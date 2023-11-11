import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import jwt from 'jsonwebtoken';

import {type UserPublic} from '../validators/UserPublic';
import {type UserCredentials} from '../validators/UserCredentials';
import {AuthenticationError} from '../customErrors';

const users = [
	{
		id: '1f234f34f2',
		username: 'hello',
		passwordHash: 'f224f234f23f',
	},
	{
		id: '1215f234fef',
		username: 'world',
		passwordHash: 'f224f2asdafgaef34f23f',
	},
];

const getAll = () => users;

const getSingle = (id: string): UserPublic | undefined => {
	const user = users.find(u => u.id === id);

	return user ? {id: user.id, username: user.username} : undefined;
};

const create = async ({username, password}: UserCredentials): Promise<UserPublic> => {
	const salt = 10;
	const passwordHash = await bcrypt.hash(password, salt);
	const id = uuidv4();

	users.push({id, username, passwordHash});

	return {id, username};
};

const getToken = async ({username, password}: UserCredentials): Promise<string> => {
	const user = users.find(u => u.username === username);

	if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
		throw new AuthenticationError('Incorrect username or password');
	}

	const tokenContent: UserPublic = {id: user.id, username: user.username};

	const secret = process.env.JWT_SECRET ?? 'secret'; // This should never be assigned

	const token = jwt.sign(tokenContent, secret);

	return token;
};

const userService = {getAll, getSingle, create, getToken};

export default userService;
