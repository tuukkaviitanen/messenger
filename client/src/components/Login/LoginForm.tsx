import * as yup from 'yup';

import FormBase from './FormBase';
import { UserCredentials } from '../../utils/types';
import loginService from '../../services/loginService';

const LoginForm = () => {
  const validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });

  const onSubmit = async (credentials: UserCredentials) => {
    const token = await loginService.getToken(credentials)
    console.log('successfully logged in user', token);
  };

  return (
    <FormBase
      header='Login'
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    />
  );
};

export default LoginForm;
