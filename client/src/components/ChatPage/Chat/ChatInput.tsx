import {Button, Paper, TextField, ToggleButton, Tooltip} from '@mui/material';
import {useFormik} from 'formik';
import {type StyleSheet} from '../../../utils/types';
import * as yup from 'yup';
import {useState} from 'react';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';

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
		flexDirection: {xs: 'column', sm: 'row'},
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
	const [multilineEnabled, setMultilineEnabled] = useState(false);

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
			<Paper id='chat-form' elevation={10} sx={styles.container}>
				<Tooltip title='Toggle multiline'>
					<ToggleButton
						id='multiline-button'
						value='multiline'
						selected={multilineEnabled}
						onChange={() => {
							setMultilineEnabled(!multilineEnabled);
						}}>
						<FormatAlignLeftIcon/>
					</ToggleButton>
				</Tooltip>

				<TextField
					id='input-field'
					sx={styles.textField}
					value={formik.values.messageField}
					onChange={formik.handleChange}
					name='messageField'
					type='text'
					multiline={multilineEnabled}
					maxRows={6}
				/>
				<Button type='submit' variant='contained'>
          Send
				</Button>
			</Paper>
		</form>
	);
};

export default ChatInput;
