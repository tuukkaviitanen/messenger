import {
	Box,
	ListItem,
	Typography,
} from '@mui/material';
import {SocketEvent, type StyleSheet, type User} from '../../utils/types';
import {useCallback, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks/typedReduxHooks';
import ChatInput, {type OnSubmit} from './ChatInput';
import {addMessage} from '../../reducers/chatSlice';

const styles: StyleSheet = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		flexGrow: 10,
	},
	inputContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		m: 1,
		p: 1,
	},
	chatArea: {
		flexGrow: 1,
		overflow: 'auto',
		height: 100, // This can be anything except 1, it will grow because of flexGrow
	},
};

const Chat = () => {
	const dispatch = useAppDispatch();

	const selectedChatIndex = useAppSelector(state => state.chat.selectedChatIndex);

	const chats = useAppSelector(state => state.chat.chats);

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
			console.log(message, timestamp);
			dispatch(addMessage({message: {message, sender: 'server', timestamp: new Date(timestamp)}}));
		});

		socket?.on(SocketEvent.ConnectionError, error => {
			dispatch(addMessage({message: {message: error.message, sender: 'connection', timestamp: new Date()}}));
		});

		return () => {
			socket?.off(SocketEvent.Message);
			socket?.off(SocketEvent.ConnectionError);
			socket?.off(SocketEvent.ServerEvent);
		};
	}, [socket, messages, dispatch]);

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
							<Typography>
								{m.sender}: {m.message}
							</Typography>
						</ListItem>
					);
				})}
			</Box>
			<ChatInput handleSendMessage={handleSendMessage} />
		</Box>
	);
};

export default Chat;
