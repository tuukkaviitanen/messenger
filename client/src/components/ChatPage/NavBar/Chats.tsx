import {Box, ListItemButton, Typography} from '@mui/material';
import {type StyleSheet, type Chat} from '../../../utils/types';

const styles: StyleSheet = {
	roomsContainer: {
		textAlign: 'center',
		p: 2,
		display: 'flex',
		flexDirection: 'column',
		overflow: 'auto',
	},
	roomsList: {
		overflow: 'auto',
	},
};

type Params = {
	chats: Chat[];
	selectedChatIndex: number;
	handleChatChange: (chatIndex: number) => void;
};

const Chats = ({chats, selectedChatIndex, handleChatChange}: Params) => (
	<Box id='chats-container' sx={styles.roomsContainer}>
		<Typography variant='h5'>Chats</Typography>
		<Box sx={styles.roomsList}>
			{chats.map((c, index) => {
				const name = c.recipients?.map(r => r.username).join(', ') ?? 'Global chat';
				return (<ListItemButton onClick={() => {
					handleChatChange(index);
				}} key={name} selected={index === selectedChatIndex}><Typography>{name}</Typography></ListItemButton>);
			})}
		</Box>

	</Box>
);

export default Chats;
