import * as yup from 'yup';

import FormBase, {type FormikOnSubmit} from './FormBase';
import userService from '../../services/userService';
import {toast} from 'react-toastify';
import axios from 'axios';
import {type ExpectedAxiosErrorResponse} from '../../utils/types';
import {Box} from '@mui/material';
import toastifyConfig from '../../../toastify.config';

const RegisterForm = () => {
	const validationSchema = yup.object({
		username: yup.string().required('Username is required').min(3).max(25),
		password: yup.string().required('Password is required').min(8),
	});

	const onSubmit: FormikOnSubmit = async (values, {resetForm}) => {
		const toastId = toast.loading('Creating user');

		try {
			const user = await userService.createUser(values);
			toast.update(toastId, {
				render: `User "${user.username}" created successfully!`,
				type: toast.TYPE.SUCCESS,
				...toastifyConfig,
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
				type: toast.TYPE.ERROR,
				...toastifyConfig,
			});
		} finally {
			resetForm();
		}
	};

	return (
		<Box id='registration-form'>
			<FormBase
				header='Register'
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			/>
		</Box>
	);
};

export default RegisterForm;
