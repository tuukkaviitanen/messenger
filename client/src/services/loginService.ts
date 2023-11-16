import axios from 'axios';
import { UserCredentials } from '../utils/types';

const baseUrl = '/api/login';

const getToken = async (user: UserCredentials) => {
  const result = await axios.post<{token: string}>(baseUrl, user);
  return result.data.token;
};

const loginService = { getToken };

export default loginService;
