import supertest from 'supertest';

import app from '../app';
import {UserModel, sequelize} from '../models';

const api = supertest(app);

const resetUsers = async () => {
	await UserModel.destroy({
		truncate: true,
	});
};

beforeAll(async () => {
	await sequelize.authenticate();
	await UserModel.sync();
});

beforeEach(async () => {
	await resetUsers();
});

describe('get user', () => {
	test('should return 404 when user not found', async () => {
		await api
			.get('/api/users/c5699691-b985-4238-aa3b-60cebdd7c29b')
			.expect(404);
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
});

afterAll(async () => {
	await sequelize.close();
});
