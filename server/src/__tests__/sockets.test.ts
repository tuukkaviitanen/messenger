/* eslint-disable max-nested-callbacks */

import {type Socket as ClientSocket, io as clientIo} from 'socket.io-client';
import {type Server as HttpServer, createServer} from 'node:http';
import {type Server} from 'socket.io';
import {type AddressInfo} from 'node:net';
import supertest from 'supertest';
import {expect, describe, it, beforeAll, beforeEach, afterAll, afterEach} from '@jest/globals';

import {app} from '../server';
import {attachSocketServerTo} from '../routes/socketRoutes';
import {type UserPublic} from '../validators/UserPublic';
import db from '../utils/db';
import {SocketEvent} from '../utils/types';
import {assertMessageContent, assertServerEventContent, createUser, resetDatabase, type UserInfo} from './test.helpers';

describe('websocket events', () => {
	let primaryClientSocket: ClientSocket;
	let secondaryClientSocket: ClientSocket;
	let httpServer: HttpServer;
	let serverUrl: string;

	let io: Server;

	const primaryUser: UserInfo = {username: 'test user 1', password: 'test password 1'};
	const secondaryUser: UserInfo = {username: 'test user 2', password: 'test password 2'};
	const passiveUser: UserInfo = {username: 'test user 3', password: 'test password 3'};

	beforeAll(async () => {
		await db.createConnection();
		await resetDatabase();

		const api = supertest(app);

		await createUser(api, primaryUser);
		await createUser(api, secondaryUser);
		await createUser(api, passiveUser);
	});

	beforeEach(done => {
		httpServer = createServer(httpServer);
		io = attachSocketServerTo(httpServer);

		httpServer.listen(() => {
			const {port} = httpServer.address() as AddressInfo;
			serverUrl = `http://localhost:${port}`;

			primaryClientSocket = clientIo(serverUrl, {auth: {token: primaryUser.token}});

			primaryClientSocket.on('connect', () => {
				secondaryClientSocket = clientIo(serverUrl, {auth: {token: secondaryUser.token}, forceNew: true, autoConnect: false});

				done();
			});
		});
	});

	afterEach(() => {
		primaryClientSocket.disconnect();
		secondaryClientSocket.disconnect();
		io.close();
		httpServer.close();
	});

	afterAll(done => {
		// Message storing is not awaited so it needs to be waited to finish
		setTimeout(async () => {
			await db.closeConnection();
			done();
		}, 500);
	});

	describe('message', () => {
		it('should receive correct message when sent to global chat', done => {
			const message = 'testmessage';

			primaryClientSocket.on('message', args => {
				assertMessageContent(args, message, 'test user 1');
				done();
			});

			primaryClientSocket.emit('message', {message});
		});

		it('should receive correct message when sent to global chat (second client)', done => {
			const message = 'testmessage';

			secondaryClientSocket.connect();

			secondaryClientSocket.on('message', args => {
				assertMessageContent(args, message, 'test user 2');

				done();
			});

			secondaryClientSocket.emit('message', {message});
		});

		it('should receive message from other clients in global chat', done => {
			const message = 'testmessage';

			secondaryClientSocket.on('message', args => {
				assertMessageContent(args, message, 'test user 1');

				done();
			});

			secondaryClientSocket.on('connect', () => {
				primaryClientSocket.emit('message', {message});
			});

			secondaryClientSocket.connect();
		});
	});

	describe('server-event', () => {
		it('should receive welcome message on connect', done => {
			secondaryClientSocket.on('server-event', args => {
				assertServerEventContent(args, 'Welcome to the messenger app. Users currently online: test user 1, test user 2');
				setTimeout(done, 100); // Timeout prevents handles from being left open; according to Jest
			});

			secondaryClientSocket.connect();
		});

		it('should receive joined message when another user connects', done => {
			primaryClientSocket.on('server-event', args => {
				if ((args.message as string).includes('Welcome')) {
					return;
				}

				assertServerEventContent(args, 'test user 2 joined the chat');
				setTimeout(done, 100); // Timeout prevents handles from being left open; according to Jest
			});

			secondaryClientSocket.connect();
		});

		it('should receive left message when another user disconnects', done => {
			primaryClientSocket.on('server-event', args => {
				if (args.message === 'test user 2 joined the chat' || (args.message as string).includes('Welcome')) {
					return;
				}

				assertServerEventContent(args, 'test user 2 left the chat');
				done();
			});

			secondaryClientSocket.on('connect', () => {
				secondaryClientSocket.disconnect();
			});
			secondaryClientSocket.connect();
		});
	});

	describe('private messages', () => {
		it('should send message to recipient', done => {
			const message = 'private message test';
			const recipients = [{username: primaryUser.username, id: primaryUser.id!}];

			const expectedRecipients = [{username: secondaryUser.username, id: secondaryUser.id!}];

			const messages: any[] = [];

			primaryClientSocket.on('message', args => {
				assertMessageContent(args, message, 'test user 2', expectedRecipients);
				messages.push(args);
			});

			secondaryClientSocket.connect();

			secondaryClientSocket.emit('message', {message, recipients});

			setTimeout(() => {
				expect(messages).toHaveLength(1);
				done();
			}, 500);
		});

		it('should NOT send message to other than recipient', done => {
			const message = 'private message test';
			const recipients = [{username: passiveUser.username, id: passiveUser.id!}];

			const messages: any[] = [];

			primaryClientSocket.on('message', args => {
				messages.push(args);
			});

			secondaryClientSocket.connect();

			secondaryClientSocket.emit('message', {message, recipients});

			setTimeout(() => {
				expect(messages).toHaveLength(0);
				done();
			}, 500);
		});
	});

	describe('users', () => {
		type UsersEventContent = {connectedUsers: UserPublic[]};

		it('should be sent when user joins', done => {
			const userEventContents: UsersEventContent[] = [];

			primaryClientSocket.on(SocketEvent.Users, (content: UsersEventContent) => {
				userEventContents.push(content);
			});

			secondaryClientSocket.on('connect', () => {
				setTimeout(() => {
					const currentUsers = userEventContents.at(-1)?.connectedUsers;
					expect(currentUsers).toHaveLength(2);
					done();
				}, 500);
			});

			secondaryClientSocket.connect();
		});

		it('should be sent when user leaves', done => {
			const userEventContents: UsersEventContent[] = [];

			primaryClientSocket.on(SocketEvent.Users, (content: UsersEventContent) => {
				userEventContents.push(content);
			});

			secondaryClientSocket.on('connect', () => {
				secondaryClientSocket.disconnect();
				setTimeout(() => {
					const currentUsers = userEventContents.at(-1)?.connectedUsers;
					expect(currentUsers).toHaveLength(1);
					done();
				}, 500);
			});

			secondaryClientSocket.connect();
		});

		it('should send single user every time when same user connects (and disconnects) with multiple clients', done => {
			secondaryClientSocket = clientIo(serverUrl, {auth: {token: primaryUser.token}, forceNew: true});

			const userEvents: UsersEventContent[] = [];

			primaryClientSocket.on(SocketEvent.Users, (content: UsersEventContent) => {
				userEvents.push(content);
			});

			secondaryClientSocket.on('connect', () => {
				secondaryClientSocket.disconnect();
				setTimeout(() => {
					expect(userEvents.map(c => c.connectedUsers).every(u => u.length === 1)).toBe(true); // In every message, there should be only one user online
					done();
				}, 500);
			});
		});
	});
});
