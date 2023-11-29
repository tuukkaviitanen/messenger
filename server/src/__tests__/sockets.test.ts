
import {type Socket as ClientSocket, io as clientIo} from 'socket.io-client';
import {type Server as HttpServer, createServer} from 'node:http';
import {type Server} from 'socket.io';
import {attachSocketServerTo} from '../app/sockets';
import {type AddressInfo} from 'node:net';
import app from '../app/express';
import supertest from 'supertest';
import {sequelize, userTable} from '../database';

import {expect, describe, it} from '@jest/globals';
import {type UserPublic} from '../validators/UserPublic';

type UserInfo = {
	username: string;
	password: string;
	token?: string;
	id?: string;
};

const createUser = async (api: supertest.SuperTest<supertest.Test>, userInfo: UserInfo) => {
	const {username, password} = userInfo;

	const user = {
		username,
		password,
	};

	const result = await api
		.post('/api/users')
		.send(user)
		.expect(201);

	userInfo.id = (result.body.id as string);

	const response = await api
		.post('/api/login')
		.send(user)
		.expect(200);

	expect(response.body).toHaveProperty('token');
	expect(typeof response.body.token === 'string').toBe(true);

	userInfo.token = (response.body.token as string);
};

const assertMessageContent = (args: any, expectedMessage: string, expectedUser: string, expectedRecipients: UserPublic[] | undefined = undefined) => {
	expect(args).toHaveProperty('message');
	expect(args).toHaveProperty('sender');
	expect(args).toHaveProperty('timestamp');
	expect(args.message).toBe(expectedMessage);
	expect(args.sender).toBe(expectedUser);
	expect(typeof args.timestamp === 'string').toBe(true);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	expect(Date.parse(args.timestamp) / 1000).toBeCloseTo(new Date().getTime() / 1000, 0);

	expect(args.recipients).toEqual(expectedRecipients);
};

const assertServerEventContent = (args: any, expectedMessage: string) => {
	expect(args).toHaveProperty('message');
	expect(args).toHaveProperty('timestamp');

	expect(typeof args.message === 'string').toBe(true);
	expect(typeof args.timestamp === 'string').toBe(true);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	expect(Date.parse(args.timestamp) / 1000).toBeCloseTo(new Date().getTime() / 1000, 0);

	expect((args.message as string)).toBe(expectedMessage);
};

describe('websocket events', () => {
	let primaryClientSocket: ClientSocket;
	let secondaryClientSocket: ClientSocket;
	let httpServer: HttpServer;

	let io: Server;

	const primaryUser: UserInfo = {username: 'test user 1', password: 'test password 1'};
	const secondaryUser: UserInfo = {username: 'test user 2', password: 'test password 2'};

	beforeAll(async () => {
		await sequelize.authenticate();
		await userTable.sync();
		await userTable.destroy({
			truncate: true,
		});

		const api = supertest(app);

		await createUser(api, primaryUser);
		await createUser(api, secondaryUser);
	});

	beforeEach(done => {
		httpServer = createServer(httpServer);
		io = attachSocketServerTo(httpServer);

		httpServer.listen(() => {
			const {port} = httpServer.address() as AddressInfo;
			const serverUrl = `http://localhost:${port}`;

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

	afterAll(async () => {
		await sequelize.close();
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
				assertServerEventContent(args, 'Welcome to the messenger app. Users currently online: initial-user, test user 1, test user 2');
				setTimeout(done, 100); // Timeout prevents handles from being left open; according to Jest
			});

			secondaryClientSocket.connect();
		});

		it('should receive joined message when another user connects', done => {
			primaryClientSocket.on('server-event', args => {
				assertServerEventContent(args, 'test user 2 joined the chat');
				setTimeout(done, 100); // Timeout prevents handles from being left open; according to Jest
			});

			secondaryClientSocket.connect();
		});

		it('should receive left message when another user disconnects', done => {
			primaryClientSocket.on('server-event', args => {
				if (args.message === 'test user 2 joined the chat') {
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
			const recipients = [{username: 'initial-user', id: 'test-id'}];

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
});
