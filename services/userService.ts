import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import {type UserPublic, type UserCredentials} from '../types';

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

const getSingle = (id: string) => users.find(u => u.id === id);

const create = async ({username, password}: UserCredentials): Promise<UserPublic> => {
	const salt = 10;
	const passwordHash = await bcrypt.hash(password, salt);
	const id = uuidv4();

	users.push({id, username, passwordHash});

	return {id, username};
};

const userService = {getAll, getSingle, create};

export default userService;
