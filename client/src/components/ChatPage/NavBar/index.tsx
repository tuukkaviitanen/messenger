import {Box, Button, Paper, Typography, ListItemButton} from '@mui/material';
import {removeCurrentUser} from '../../../reducers/userSlicer';
import {useAppDispatch, useAppSelector} from '../../../hooks/typedReduxHooks';
import {type User, type StyleSheet, SocketEvent} from '../../../utils/types';
import {useEffect, useState} from 'react';
import {addChat, setSelectedChatIndex} from '../../../reducers/chatSlice';
import {usersArrayEqual} from '../../../utils/helpers';
import Users from './Users';

const styles: StyleSheet = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		p: 1,
		m: 1,
		flex: 1,
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

	const chats = useAppSelector(state => state.chat.chats);
	const selectedChatIndex = useAppSelector(state => state.chat.selectedChatIndex);

	const handleLogout = () => {
		dispatch(removeCurrentUser());
	};

	const handleChatChange = (index: number) => {
		dispatch(setSelectedChatIndex(index));
	};

	const handleNewChat = (user: User) => {
		const chatIndex = chats.findIndex(c => usersArrayEqual(c.recipients, [user]));

		if (chatIndex === -1) { // If chat is NOT already created
			dispatch(addChat({chat: {messages: [], recipients: [user]}}));
			handleChatChange(chats.length);
		} else { // Chat is already create
			handleChatChange(chatIndex);
		}
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

			<Users connectedUsers={connectedUsers} currentUser={currentUser} handleNewChat={handleNewChat}/>

		</Paper>
	);
};

export default NavBar;
