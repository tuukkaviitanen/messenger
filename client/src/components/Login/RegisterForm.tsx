import * as yup from 'yup';

import FormBase from './FormBase';
import { UserCredentials } from '../../utils/types';

const RegisterForm = () => {
  const validationSchema = yup.object({
    username: yup.string().required('Username is required').min(8),
    password: yup.string().required('Password is required').min(8),
  });

  const onSubmit = (values: UserCredentials) => {
    console.log('registered user', values);
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
