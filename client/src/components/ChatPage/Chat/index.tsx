import {
	Box,
	ListItem,
} from '@mui/material';
import {SocketEvent, type StyleSheet, type User} from '../../../utils/types';
import {useCallback, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../../hooks/typedReduxHooks';
import ChatInput, {type OnSubmit} from './ChatInput';
import {addMessage} from '../../../reducers/chatSlice';
import ChatMessage from './ChatMessage';
import {useLogoutUser} from '../../../hooks/loginHooks';
import {toast} from 'react-toastify';

const styles: StyleSheet = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		flex: 3,
	},
	inputContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		m: 1,
		p: 1,
	},
	chatArea: {
		flex: 1,
		overflow: 'auto',
	},
};

const Chat = () => {
	const dispatch = useAppDispatch();

	const selectedChatIndex = useAppSelector(state => state.chat.selectedChatIndex);

	const chats = useAppSelector(state => state.chat.chats);

	const logoutUser = useLogoutUser();

	const chat = chats[selectedChatIndex];

	const {messages} = chat;

	const socket = useAppSelector(state => state.socket.connection);

	// eslint-disable-next-line @typescript-eslint/ban-types
	const setRef = useCallback((node: HTMLElement | null) => {
		if (node) {
			node.scrollIntoView({behavior: 'smooth'});
		}
	}, []);

	type MessageContent = {
		sender: string;
		message: string;
		recipients?: User[];
		timestamp: string;
	};

	type ServerEventContent = {
		message: string;
		timestamp: string;
	};

	useEffect(() => {
		socket?.on(
			SocketEvent.Message,
			({sender, message, timestamp, recipients}: MessageContent) => {
				dispatch(addMessage({message: {message, sender, timestamp: new Date(timestamp)}, recipients}));
			},
		);

		socket?.on(SocketEvent.ServerEvent, ({message, timestamp}: ServerEventContent) => {
			dispatch(addMessage({message: {message, sender: 'server', timestamp: new Date(timestamp)}}));
		});

		socket?.on(SocketEvent.ConnectionError, error => {
			toast.error(`User logged out due to a connection error: ${error.message}`);
			logoutUser();
		});

		return () => {
			socket?.off(SocketEvent.Message);
			socket?.off(SocketEvent.ConnectionError);
			socket?.off(SocketEvent.ServerEvent);
		};
	}, [socket, messages, dispatch, logoutUser]);

	const handleSendMessage: OnSubmit = ({messageField}, {resetForm}) => {
		socket?.emit(SocketEvent.Message, {message: messageField, recipients: chat.recipients});
		resetForm();
	};

	return (
		<Box sx={styles.container}>
			<Box sx={styles.chatArea}>
				{messages.map((m, index) => {
					const lastMessage = messages.length - 1 === index;
					return (
						<ListItem
							ref={lastMessage ? setRef : null}
							key={m.sender + m.message + m.timestamp.toISOString()}
						>
							<ChatMessage message={m} />
						</ListItem>
					);
				})}
			</Box>
			<ChatInput handleSendMessage={handleSendMessage} />
		</Box>
	);
};

export default Chat;
