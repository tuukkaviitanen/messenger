import app from './app';
import {createServer, type Server as HttpServer} from 'node:http';
import {Server} from 'socket.io';
import logger from './utils/logger';
import {type UserPublic} from './validators/UserPublic';
import {tokenParserMiddleware} from './utils/middleware';
import {type SocketWithUser} from './utils/types';
import config from './utils/config';

const server = createServer(app);

export const attachSocketServerTo = (httpServer: HttpServer) => {
	const io = new Server(httpServer);

	io.use(tokenParserMiddleware);

	enum SocketEvent {
		Connection = 'connection',
		Disconnect = 'disconnect',
		Message = 'message',
		Users = 'users',
		ServerEvent = 'server-event',
	}

	type MessageContent = {
		sender: string;
		message: string;
		recipients?: UserPublic[];
		timestamp: Date;
	};

	const createMessageEvent = (
		content: Omit<MessageContent, 'timestamp'>,
	): [string, MessageContent] => [SocketEvent.Message, {...content, timestamp: new Date()}];

	// In test mode, initial user is created
	let connectedUsers: UserPublic[] = (config.nodeEnv === 'test') ? [{id: '9c5b94b1-35ad-49bb-b118-8e8fc24abf8', username: 'initial-user'}] : [];

	const addUser = (user: UserPublic) => {
		connectedUsers
			= connectedUsers.find(u => u.id === user.id) === undefined
				? connectedUsers.concat(user)
				: connectedUsers;
		io.emit(SocketEvent.Users, {connectedUsers});
	};

	const removeUser = (user: UserPublic) => {
		connectedUsers = connectedUsers.filter(u => u.id !== user.id);
		io.emit(SocketEvent.Users, {connectedUsers});
	};

	io.on(SocketEvent.Connection, async socket => {
		const {user} = socket as SocketWithUser;
		await socket.join(user.id);

		addUser(user);

		logger.log(`socket ${socket.id} connected as user ${user.username}`);
		socket.broadcast.emit(
			SocketEvent.ServerEvent,
			{message: `${user.username} joined the chat`, timestamp: new Date()},
		);
		socket.emit(
			SocketEvent.ServerEvent,
			{
				message: `Welcome to the messenger app. Users currently online: ${connectedUsers
					.map(u => u.username)
					.join(', ')}`,
				timestamp: new Date(),
			});

		socket.on(SocketEvent.Message, ({message, recipients}: {message: string; recipients?: UserPublic[]}) => {
			if (recipients) {
				recipients.push(user);
				recipients.forEach(recipient =>
					io.to(recipient.id).emit(
						...createMessageEvent({
							sender: user.username,
							message,
							recipients: [...recipients.filter(r => r.id !== recipient.id)],
						}),
					),
				);
			} else {
				io.emit(
					...createMessageEvent({
						sender: user.username,
						message,
					}),
				);
			}
		});

		socket.on(SocketEvent.Disconnect, () => {
			logger.log(`${user.username} disconnected`);
			socket.broadcast.emit(
				SocketEvent.ServerEvent,
				{message: `${user.username} left the chat`, timestamp: new Date()},
			);
			removeUser(user);
		});
	});

	return io;
};

attachSocketServerTo(server);

export default server;
