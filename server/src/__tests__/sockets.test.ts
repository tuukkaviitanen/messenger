
import {type Socket as ClientSocket, io as clientIo} from 'socket.io-client';
import {type Server as HttpServer, createServer} from 'node:http';
import {type Server} from 'socket.io';
import {attachSocketServerTo} from '../server';
import {type AddressInfo} from 'node:net';
import app from '../app';
import supertest from 'supertest';
import {sequelize, userTable} from '../database';

import {expect} from '@jest/globals';

describe('WebSocket events', () => {
	let clientSocket: ClientSocket;
	let secondClientSocket: ClientSocket;
	let httpServer: HttpServer;

	let io: Server;

	const api = supertest(app);

	let token: string;

	beforeAll(async () => {
		await sequelize.authenticate();
		await userTable.sync();
	});

	beforeEach(async () => {
		await userTable.destroy({
			truncate: true,
		});

		const user = {
			username: 'hellouser',
			password: 'password',
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

		token = (response.body.token as string);

		// Start the server and establish socket connection
		httpServer = createServer(httpServer);
		io = attachSocketServerTo(httpServer);

		// Promise is needed to wait for socket connections to be ready
		await new Promise<void>(resolve => {
			httpServer.listen(() => {
				const {port} = httpServer.address() as AddressInfo;
				const serverUrl = `http://localhost:${port}`;

				clientSocket = clientIo(serverUrl, {auth: {token}});

				clientSocket.on('connect', () => {
					secondClientSocket = clientIo(serverUrl, {auth: {token}, forceNew: true, autoConnect: false});

					resolve();
				});
			});
		});
	});

	afterEach(() => {
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
				expect(args).toHaveProperty('message');
				expect(args).toHaveProperty('sender');
				expect(args).toHaveProperty('timestamp');
				expect(args.message).toBe(message);
				expect(args.sender).toBe('hellouser');
				expect(typeof args.timestamp === 'string').toBe(true);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				expect(Date.parse(args.timestamp) / 1000).toBeCloseTo(new Date().getTime() / 1000, 0);

				done();
			});

			clientSocket.emit('message', {message});
		});

		it('Should return message sent with sender username and timestamp string', done => {
			const message = 'testmessage';

			secondClientSocket.connect();

			secondClientSocket.on('message', args => {
				expect(args).toHaveProperty('message');
				expect(args).toHaveProperty('sender');
				expect(args).toHaveProperty('timestamp');
				expect(args.message).toBe(message);
				expect(args.sender).toBe('hellouser');
				expect(typeof args.timestamp === 'string').toBe(true);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				expect(Date.parse(args.timestamp) / 1000).toBeCloseTo(new Date().getTime() / 1000, 0);

				done();
			});

			secondClientSocket.emit('message', {message});
		});
	});
});
