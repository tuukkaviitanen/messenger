import * as yup from 'yup';

import FormBase, { FormikOnSubmit } from './FormBase';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ExpectedAxiosErrorResponse } from '../../utils/types';

const RegisterForm = () => {
  const validationSchema = yup.object({
    username: yup.string().required('Username is required').min(8),
    password: yup.string().required('Password is required').min(8),
  });

  const onSubmit: FormikOnSubmit = async (values, { resetForm }) => {
    const toastId = toast.loading('Creating user');

    try {
      const user = await userService.createUser(values);
      toast.update(toastId, {
        render: `User "${user.username}" created successfully!`,
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      });
    } catch (ex) {
      let message: string | undefined;

      if (axios.isAxiosError<ExpectedAxiosErrorResponse>(ex)) {
        message = `User creation failed! ${ex.response?.data.error}`;
      } else {
        message = 'User creation failed!';
      }
      toast.update(toastId, {
        render: message,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
      console.error('creating user failed', ex);
    } finally {
      resetForm();
    }
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
