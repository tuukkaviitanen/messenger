import * as yup from 'yup';

import FormBase from './FormBase';
import { UserCredentials } from '../../utils/types';
import userService from '../../services/userService';

const RegisterForm = () => {
  const validationSchema = yup.object({
    username: yup.string().required('Username is required').min(8),
    password: yup.string().required('Password is required').min(8),
  });

  const onSubmit = async (values: UserCredentials) => {
    const user = await userService.createUser(values);
    console.log('registration successful', user);
  };

  return (
    <FormBase
      header='Register'
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    />
  );
};

export default RegisterForm;
