import * as yup from 'yup';

import FormBase, {type FormikOnSubmit} from './FormBase';
import loginService from '../../services/loginService';
import {toast} from 'react-toastify';
import axios from 'axios';
import {type ExpectedAxiosErrorResponse} from '../../utils/types';
import {Box} from '@mui/material';
import {useLoginUser} from '../../hooks/loginHooks';
import toastifyConfig from '../../../toastify.config';

const LoginForm = () => {
	const loginUser = useLoginUser();

	const validationSchema = yup.object({
		username: yup.string().required('Username is required'),
		password: yup.string().required('Password is required'),
	});

	const onSubmit: FormikOnSubmit = async (credentials, {resetForm}) => {
		const toastId = toast.loading(`Logging in as ${credentials.username}`);
		try {
			const currentUser = await loginService.login(credentials);
			loginUser(currentUser);
			toast.update(toastId, {
				render: `Successfully logged in as ${credentials.username}`,
				type: toast.TYPE.SUCCESS,
				...toastifyConfig,
			});
		} catch (ex) {
			let message: string | undefined;

			if (axios.isAxiosError<ExpectedAxiosErrorResponse>(ex)) {
				message = `Login failed! ${ex.response?.data.error}`;
			} else {
				message = 'Login failed!';
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
		<Box id='login-form'>
			<FormBase
				header='Login'
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			/>
		</Box>

	);
};

export default LoginForm;
