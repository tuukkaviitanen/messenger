import {Box, Button, Paper, Typography} from '@mui/material';
import {removeCurrentUser} from '../../../reducers/userSlicer';
import {useAppDispatch, useAppSelector} from '../../../hooks/typedReduxHooks';
import {type User, type StyleSheet, SocketEvent} from '../../../utils/types';
import {useEffect, useState} from 'react';
import {addChat, setSelectedChatIndex} from '../../../reducers/chatSlice';
import {usersArrayEqual} from '../../../utils/helpers';
import Users from './Users';
import Chats from './Chats';

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

			<Chats chats={chats} handleChatChange={handleChatChange} selectedChatIndex={selectedChatIndex}/>

			<Users connectedUsers={connectedUsers} currentUser={currentUser} handleNewChat={handleNewChat}/>

		</Paper>
	);
};

export default NavBar;
