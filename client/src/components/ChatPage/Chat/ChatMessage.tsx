import {Paper, Typography} from '@mui/material';
import {type StyleSheet, type Message} from '../../../utils/types';

const styles: StyleSheet = {
	container: {
		py: 1,
		px: 2,
	},
	sender: {
		fontWeight: 500,
	},
	messageContent: {
		wordBreak: 'break-word',
	},
	timestamp: {
		fontSize: 12,
		float: 'right',
	},
};

type Params = {
	message: Message;
};

const ChatMessage = ({message}: Params) => {
	const today = new Date().setHours(0, 0, 0, 0);
	const isSentToday = today === new Date(message.timestamp).setHours(0, 0, 0, 0);
	const isSentThisYear = new Date(today).getFullYear() === message.timestamp.getFullYear();

	const onlyTimeOptions: Intl.DateTimeFormatOptions = {hour: '2-digit', minute: '2-digit'};
	const dateOptions: Intl.DateTimeFormatOptions = {...onlyTimeOptions, day: '2-digit', month: 'short'};
	const fullDateOptions: Intl.DateTimeFormatOptions = {...dateOptions, year: 'numeric'};

	const timeString = message.timestamp.toLocaleTimeString([], isSentToday ? onlyTimeOptions : isSentThisYear ? dateOptions : fullDateOptions);

	return (
		<Paper sx={styles.container}>
			<Typography sx={styles.sender}>
				{message.sender}
			</Typography>
			<Typography sx={styles.messageContent}>
				{message.message}
			</Typography>
			<Typography sx={styles.timestamp}>Sent {timeString}</Typography>
		</Paper>

	);
};

export default ChatMessage;
