import axios from 'axios';
import {type User, type UserCredentials} from '../utils/types';

const baseUrl = '/api/users';

const createUser = async (user: UserCredentials) => {
	const result = await axios.post<User>(baseUrl, user);
	return result.data;
};

const userService = {createUser};

export default userService;
