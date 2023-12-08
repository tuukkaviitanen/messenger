import {Paper, Typography} from '@mui/material';
import {type StyleSheet, type Message} from '../../../utils/types';

const styles: StyleSheet = {
	container: {
		py: 1,
		px: 2,
	},
};

type Params = {
	message: Message;
};

const ChatMessage = ({message}: Params) => {
	const today = new Date().setHours(0, 0, 0, 0);
	const isSentToday = today === new Date(message.timestamp).setHours(0, 0, 0, 0);

	const onlyTimeOptions: Intl.DateTimeFormatOptions = {hour: '2-digit', minute: '2-digit'};
	const fullDateOptions: Intl.DateTimeFormatOptions = {hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short'};

	const timeString = message.timestamp.toLocaleTimeString([], isSentToday ? onlyTimeOptions : fullDateOptions);

	return (
		<Paper sx={styles.container}>
			<Typography variant='subtitle2'>
				{message.sender}
			</Typography>
			<Typography>
				{message.message}
			</Typography>
			<Typography sx={{p: 0}} variant='overline'>Sent {timeString}</Typography>
		</Paper>

	);
};

export default ChatMessage;
