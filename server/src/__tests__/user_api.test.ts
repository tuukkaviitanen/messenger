import supertest from 'supertest';
import {app} from '../server';
import {expect} from '@jest/globals';
import {User} from '../entities/User';
import db from '../utils/db';
import {ChatMessage} from '../entities/ChatMessage';

const api = supertest(app);

const resetDatabase = async () => {
	await ChatMessage.delete({});
	await User.delete({});
};

beforeAll(async () => {
	await db.createConnection();
});

beforeEach(async () => {
	await resetDatabase();
});

describe('user api', () => {
	describe('get user', () => {
		test('should return 404 when user not found', async () => {
			await api
				.get('/api/users/c5699691-b985-4238-aa3b-60cebdd7c29b')
				.expect(404);
		});

		test('should return 200 and user when found', async () => {
			const createdUser = await User.save({username: 'hellouser', passwordHash: 'passwordhash'});

			const response = await api
				.get(`/api/users/${createdUser.id}`)
				.expect(200);

			const expectedUser = {id: createdUser.id, username: createdUser.username};

			expect(response.body).toEqual(expectedUser);
		});
	});

	describe('create user', () => {
		test('should return 400 when invalid username', async () => {
			const user = {
				username: 'he',
				password: 'password',
			};

			await api
				.post('/api/users')
				.send(user)
				.expect(400)
				.expect('Content-Type', /application\/json/);
		});

		test('should return 400 when invalid password', async () => {
			const user = {
				username: 'hellouser',
				password: 'pa',
			};

			await api
				.post('/api/users')
				.send(user)
				.expect(400)
				.expect('Content-Type', /application\/json/);
		});

		test('should return 201 and created user when valid credentials', async () => {
			const user = {
				username: 'hellouser',
				password: 'password',
			};

			const response = await api
				.post('/api/users')
				.send(user)
				.expect(201)
				.expect('Content-Type', /application\/json/);

			const createdUser = await User.findOneBy({username: user.username});

			expect(createdUser).toBeDefined();

			const expectedUser = {id: createdUser!.id, username: createdUser!.username};

			expect(response.body).toEqual(expectedUser);
		});

		test('should return 400 when username already exists', async () => {
			const user = {
				username: 'hellouser',
				password: 'password',
			};

			await api
				.post('/api/users')
				.send(user)
				.expect(201);

			await api
				.post('/api/users')
				.send(user)
				.expect(400);
		});
	});

	describe('login', () => {
		test('should return token if credentials valid', async () => {
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
		});

		test('should return 401 if credentials invalid', async () => {
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
				.send({...user, password: 'passwords'})
				.expect(401);

			expect(response.body).not.toHaveProperty('token');
		});

		test('should return 401 if credentials invalid', async () => {
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
				.send({...user, username: 'hellousers'})
				.expect(401);

			expect(response.body).not.toHaveProperty('token');
		});
	});
});

afterAll(async () => {
	await db.closeConnection();
});
