import {Box, Button, ListItem, Paper, Typography} from '@mui/material';
import {removeCurrentUser} from '../../reducers/userSlicer';
import {useAppDispatch, useAppSelector} from '../../hooks/typedReduxHooks';
import {type User, type StyleSheet, SocketEvent} from '../../utils/types';
import {useEffect, useState} from 'react';

const styles: StyleSheet = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		p: 1,
		m: 1,
		flexGrow: 1,
	},
	text: {
		textAlign: 'center',
	},
	loginContainer: {
		display: 'flex',
		flexDirection: 'column',
	},
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

const NavBar = () => {
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(state => state.user.currentUser);
	const socket = useAppSelector(state => state.socket.connection);
	const [connectedUsers, setConnectedUsers] = useState<User[]>([]);

	const handleLogout = () => {
		dispatch(removeCurrentUser());
	};

	useEffect(() => {
		socket?.on(SocketEvent.Users, ({connectedUsers}: {connectedUsers: User[]}) => {
			setConnectedUsers(connectedUsers);
		});

		return () => {
			socket?.off(SocketEvent.Users);
		};
	}, [socket]);

	return (
		<Paper elevation={10} sx={styles.container}>
			<Box sx={styles.loginContainer}>
				<Typography sx={styles.text} >Logged in as {currentUser?.username}</Typography>
				<Button variant='outlined' onClick={handleLogout}>
        Logout
				</Button>
			</Box>

			<Box sx={styles.roomsContainer}>
				<Typography variant='h5'>Chats</Typography>
				<Box sx={styles.roomsList}>
					<ListItem><Typography>Rooms come here</Typography></ListItem>
					<ListItem><Typography>Rooms come here</Typography></ListItem>
					<ListItem><Typography>Rooms come here</Typography></ListItem>
					<ListItem><Typography>Rooms come here</Typography></ListItem>
				</Box>

			</Box>

			<Paper sx={styles.usersContainer}>
				<Typography variant='h5'>Users online</Typography>
				<Box sx={styles.usersList}>
					{connectedUsers.map(u => <Typography key={u.id}>{u.username}</Typography>)}

				</Box>

			</Paper>
		</Paper>
	);
};

export default NavBar;
