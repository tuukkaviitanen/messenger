import {Box, Button, TextField, Typography, Paper} from '@mui/material';
import {type StyleSheet, type UserCredentials} from '../../utils/types';
import {useFormik} from 'formik';
import type * as yup from 'yup';

const styles: StyleSheet = {
	container: {
		display: 'grid',
		placeItems: 'center',
	},
	formContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		p: 2,
		m: 2,
	},
	formControl: {
		m: 1,
	},
	button: {
		p: 2,
	},
};

export type FormikOnSubmit = (values: UserCredentials, actions: {resetForm: () => void}) => Promise<void>;

type Params = {
	header: string;
	onSubmit: FormikOnSubmit;
	validationSchema: yup.ObjectSchema<
	{
		username: string;
		password: string;
	}
	>;
};

const FormBase = ({header, onSubmit, validationSchema}: Params) => {
	const initialValues = {username: '', password: ''};

	const formik = useFormik({
		initialValues,
		onSubmit,
		validationSchema,
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<Box sx={styles.container}>
				<Paper elevation={5} sx={styles.formContainer}>
					<Typography variant='h4' sx={styles.header}>
						{header}
					</Typography>
					<TextField
						sx={styles.formControl}
						name='username'
						type='text'
						label='Username'
						value={formik.values.username}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.username && Boolean(formik.errors.username)}
						helperText={formik.touched.password && formik.errors.username}
					/>

					<TextField
						sx={styles.formControl}
						name='password'
						type='password'
						label='Password'
						value={formik.values.password}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.password && Boolean(formik.errors.password)}
						helperText={formik.touched.password && formik.errors.password}
					/>
					<Button type='submit' variant='contained' sx={styles.formControl}>
						{header}
					</Button>
				</Paper>
			</Box>
		</form>
	);
};

export default FormBase;
