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
	const timeString = message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

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
