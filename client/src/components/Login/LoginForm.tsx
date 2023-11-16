import * as yup from 'yup';

import FormBase, { FormikOnSubmit } from './FormBase';
import loginService from '../../services/loginService';
import { setCurrentUser } from '../../reducers/userReducer';
import { useAppDispatch } from '../../hooks';

const LoginForm = () => {
  const dispatch = useAppDispatch()

  const validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });

  const onSubmit: FormikOnSubmit = async (credentials) => {
    const currentUser = await loginService.login(credentials)

    dispatch(setCurrentUser(currentUser))
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
