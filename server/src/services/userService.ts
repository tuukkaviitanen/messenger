import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {type UserPublic} from '../validators/UserPublic';
import {type UserCredentials} from '../validators/UserCredentials';
import {AuthenticationError} from '../utils/customErrors';
import config from '../utils/config';
import {User} from '../entities/User';

const userToPublicUser = (user: User): UserPublic => ({id: user.id, username: user.username});

const getAll = async () => {
	const users = await User.find();

	return users.map(u => (userToPublicUser(u)));
};

const getSingle = async (id: string) => {
	const user = await User.findOneBy({id});

	if (!user) {
		return undefined;
	}

	return userToPublicUser(user);
};

const create = async ({username, password}: UserCredentials): Promise<UserPublic> => {
	const salt = 10;
	const passwordHash = await bcrypt.hash(password, salt);

	const createdUser = await User.save({username, passwordHash});

	return userToPublicUser(createdUser);
};

const getToken = async ({username, password}: UserCredentials): Promise<string> => {
	const user = await User.findOneBy({username});

	if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
		throw new AuthenticationError('Incorrect username or password');
	}

	const tokenContent: UserPublic = {id: user.id, username: user.username};

	const {secret} = config;

	const token = jwt.sign(tokenContent, secret);

	return token;
};

let onlineUsers: UserPublic[] = [];

const getAllOnline = () => onlineUsers;

const setOnline = (user: UserPublic) => {
	onlineUsers
		= onlineUsers.find(u => u.id === user.id) === undefined
			? onlineUsers.concat(user)
			: onlineUsers;
};

const setOffline = (user: UserPublic) => {
	onlineUsers = onlineUsers.filter(u => u.id !== user.id);
};

const clearAllOnlineUsers = () => {
	onlineUsers = [];
};

const userService = {getAll, getSingle, create, getToken, getAllOnline, setOnline, setOffline, clearAllOnlineUsers};

export default userService;
