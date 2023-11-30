import {Box, ListItemButton, Paper, Typography} from '@mui/material';
import {type User, type StyleSheet} from '../../../utils/types';
import {type UserWithToken} from '../../../validators/UserWithToken';

const styles: StyleSheet = {
	usersContainer: {
		marginTop: 'auto',
		p: 2,
		textAlign: 'center',
		maxHeight: '30%',
		display: 'flex',
		flexDirection: 'column',
	},
	usersList: {
		textAlign: 'center',
		overflow: 'auto',
	},
};

type Params = {
	connectedUsers: User[];
	currentUser?: UserWithToken;
	handleNewChat: (user: User) => void;
};

const Users = ({connectedUsers, currentUser, handleNewChat}: Params) => (
	<Paper id='users-container' sx={styles.usersContainer}>
		<Typography variant='h5'>Users online</Typography>
		<Box sx={styles.usersList}>
			{connectedUsers.map(u => <ListItemButton key={u.id} onClick={() => {
				handleNewChat(u);
			}} disabled={u.username === currentUser?.username}> <Typography>{u.username}</Typography></ListItemButton>)}

		</Box>

	</Paper>
);

export default Users;
