
import {type Socket as ClientSocket, io as clientIo} from 'socket.io-client';
import {type Server as HttpServer, createServer} from 'node:http';
import {type Server} from 'socket.io';
import {attachSocketServerTo} from '../server';
import {type AddressInfo} from 'node:net';
import app from '../app';
import supertest from 'supertest';
import {sequelize, userTable} from '../database';

import {expect, describe, it} from '@jest/globals';

type UserInfo = {
	username: string;
	password: string;
	token?: string;
};

const createUser = async (api: supertest.SuperTest<supertest.Test>, userInfo: UserInfo) => {
	const {username, password} = userInfo;

	const user = {
		username,
		password,
	};

	await api
		.post('/api/users')
		.send(user)
		.expect(201);

	const response = await api
		.post('/api/login')
		.send(user)
		.expect(200);

	expect(response.body).toHaveProperty('token');
	expect(typeof response.body.token === 'string').toBe(true);

	userInfo.token = (response.body.token as string);
};

const assertMessageContent = (args: any, expectedMessage: string, expectedUser: string) => {
	expect(args).toHaveProperty('message');
	expect(args).toHaveProperty('sender');
	expect(args).toHaveProperty('timestamp');
	expect(args.message).toBe(expectedMessage);
	expect(args.sender).toBe(expectedUser);
	expect(typeof args.timestamp === 'string').toBe(true);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	expect(Date.parse(args.timestamp) / 1000).toBeCloseTo(new Date().getTime() / 1000, 0);
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

describe('WebSocket events', () => {
	let clientSocket: ClientSocket;
	let secondClientSocket: ClientSocket;
	let httpServer: HttpServer;

	let io: Server;

	const users: UserInfo[] = [
		{username: 'test user 1', password: 'test password 1'},
		{username: 'test user 2', password: 'test password 2'},
	];

	beforeAll(async () => {
		await sequelize.authenticate();
		await userTable.sync();
		await userTable.destroy({
			truncate: true,
		});

		const api = supertest(app);

		await createUser(api, users[0]);
		await createUser(api, users[1]);
	});

	beforeEach(done => {
		httpServer = createServer(httpServer);
		io = attachSocketServerTo(httpServer);

		httpServer.listen(() => {
			const {port} = httpServer.address() as AddressInfo;
			const serverUrl = `http://localhost:${port}`;

			clientSocket = clientIo(serverUrl, {auth: {token: users[0].token}});

			clientSocket.on('connect', () => {
				secondClientSocket = clientIo(serverUrl, {auth: {token: users[1].token}, forceNew: true, autoConnect: false});

				done();
			});
		});
	});

	afterEach(() => {
		clientSocket.off();
		secondClientSocket.off();

		clientSocket.disconnect();
		secondClientSocket.disconnect();
		io.close();
		httpServer.close();
	});

	afterAll(async () => {
		await sequelize.close();
	});

	describe('message', () => {
		it('Should return message sent with sender username and timestamp string', done => {
			const message = 'testmessage';

			clientSocket.on('message', args => {
				assertMessageContent(args, message, 'test user 1');
				done();
			});

			clientSocket.emit('message', {message});
		});

		it('Should return message sent with sender username and timestamp string (second client)', done => {
			const message = 'testmessage';

			secondClientSocket.connect();

			secondClientSocket.on('message', args => {
				assertMessageContent(args, message, 'test user 2');

				done();
			});

			secondClientSocket.emit('message', {message});
		});

		it('Should get message from other clients in global chat', done => {
			const message = 'testmessage';

			secondClientSocket.on('message', args => {
				assertMessageContent(args, message, 'test user 1');

				done();
			});

			secondClientSocket.on('connect', () => {
				clientSocket.emit('message', {message});
			});

			secondClientSocket.connect();
		});
	});

	describe('server-event', () => {
		it('Should send welcome-message on connect', done => {
			secondClientSocket.on('server-event', args => {
				assertServerEventContent(args, 'Welcome to the messenger app. Users currently online: initial-user, test user 1, test user 2');
				done();
			});

			secondClientSocket.connect();
		});

		it('Should send joined message when another user connects', done => {
			clientSocket.on('server-event', args => {
				assertServerEventContent(args, 'test user 2 joined the chat');
				done();
			});

			secondClientSocket.connect();
		});

		it('Should send left message when another user disconnects', done => {
			clientSocket.on('server-event', args => {
				if (args.message === 'test user 2 joined the chat') {
					return;
				}

				assertServerEventContent(args, 'test user 2 left the chat');
				done();
			});

			secondClientSocket.on('connect', () => {
				secondClientSocket.disconnect();
			});
			secondClientSocket.connect();
		});
	});
});
