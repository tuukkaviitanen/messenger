import {Button, Paper, TextField} from '@mui/material';
import {useFormik} from 'formik';
import {type StyleSheet} from '../../utils/types';
import * as yup from 'yup';

type InitialValues = {
	messageField: string;
};

export type OnSubmit = (values: InitialValues, actions: {resetForm: () => void}) => void;

type Params = {
	handleSendMessage: OnSubmit;
};

const styles: StyleSheet = {
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		m: 1,
		p: 1,
	},
	textField: {
		flexGrow: 1,
	},
};

const ChatInput = ({handleSendMessage}: Params) => {
	const initialValues: InitialValues = {messageField: ''};

	const validationSchema = yup.object({
		messageField: yup.string().required(),
	});

	const formik = useFormik({
		initialValues,
		onSubmit: handleSendMessage,
		validationSchema,
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<Paper elevation={10} sx={styles.container}>
				<TextField
					sx={styles.textField}
					value={formik.values.messageField}
					onChange={formik.handleChange}
					name='messageField'
					type='text'
				/>
				<Button type='submit' variant='contained'>
          Send
				</Button>
			</Paper>
		</form>
	);
};

export default ChatInput;
