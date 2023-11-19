import axios from 'axios';
import {type UserCredentials} from '../utils/types';
import {type UserWithToken} from '../validators/UserWithToken';

const baseUrl = '/api/login';

const login = async (user: UserCredentials) => {
	const result = await axios.post<UserWithToken>(baseUrl, user);
	return result.data;
};

const loginService = {login};

export default loginService;
