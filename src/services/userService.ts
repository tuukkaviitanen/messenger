import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {type UserPublic} from '../validators/UserPublic';
import {type UserCredentials} from '../validators/UserCredentials';
import {AuthenticationError} from '../customErrors';
import {type User} from '../models/User';
import {UserModel} from '../models';
import config from '../utils/config';

const userToPublicUser = (user: User): UserPublic => ({id: user.id, username: user.username});

const getAll = async () => {
	const users = await UserModel.findAll();

	return users.map(u => (userToPublicUser(u)));
};

const getSingle = async (id: string) => {
	const user = await UserModel.findByPk(id);

	if (!user) {
		return undefined;
	}

	return userToPublicUser(user);
};

const create = async ({username, password}: UserCredentials): Promise<UserPublic> => {
	const salt = 10;
	const passwordHash = await bcrypt.hash(password, salt);

	const createdUser = await UserModel.create({username, passwordHash});

	return userToPublicUser(createdUser);
};

const getToken = async ({username, password}: UserCredentials): Promise<string> => {
	const user = await UserModel.findOne({where: {username}});

	if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
		throw new AuthenticationError('Incorrect username or password');
	}

	const tokenContent: UserPublic = {id: user.id, username: user.username};

	const secret = config.jwtSecret;

	const token = jwt.sign(tokenContent, secret);

	return token;
};

const userService = {getAll, getSingle, create, getToken};

export default userService;
