import type supertest from 'supertest';
import {expect} from '@jest/globals';

import {User} from '../entities/User';
import {ChatMessage} from '../entities/ChatMessage';
import {type UserPublic} from '../validators/UserPublic';

export type UserInfo = {
	username: string;
	password: string;
	token?: string;
	id?: string;
};

export const createUser = async (api: supertest.SuperTest<supertest.Test>, userInfo: UserInfo) => {
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

export const assertMessageContent = (args: any, expectedMessage: string, expectedUser: string, expectedRecipients: UserPublic[] | undefined = undefined) => {
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

export const assertServerEventContent = (args: any, expectedMessage: string) => {
	expect(args).toHaveProperty('message');
	expect(args).toHaveProperty('timestamp');

	expect(typeof args.message === 'string').toBe(true);
	expect(typeof args.timestamp === 'string').toBe(true);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	expect(Date.parse(args.timestamp) / 1000).toBeCloseTo(new Date().getTime() / 1000, 0);

	expect((args.message as string)).toBe(expectedMessage);
};

export const resetDatabase = async () => {
	await ChatMessage.delete({});
	await User.delete({});
};
