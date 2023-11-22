import app from './app';
import {createServer, type Server as HttpServer} from 'node:http';
import {Server} from 'socket.io';
import logger from './utils/logger';
import {type UserPublic} from './validators/UserPublic';
import {tokenParserMiddleware} from './utils/middleware';
import {type SocketWithUser} from './utils/types';

const server = createServer(app);

export const attachSocketServerTo = (httpServer: HttpServer) => {
	const io = new Server(httpServer);

	io.use(tokenParserMiddleware);

	enum SocketEvent {
		Connection = 'connection',
		Disconnect = 'disconnect',
		Message = 'message',
		Users = 'users',
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

	let connectedUsers: UserPublic[] = [];

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

		logger.info(`socket ${socket.id} connected as user ${user.username}`);
		socket.broadcast.emit(
			...createMessageEvent({
				sender: user.username,
				message: 'joined the chat',
			}),
		);
		socket.emit(
			...createMessageEvent({
				sender: 'server',
				message: `Welcome to the messenger app. Users currently online: ${connectedUsers
					.map(u => u.username)
					.join(', ')}`,
			}),
		);

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
			logger.info(`${user.username} disconnected`);
			socket.broadcast.emit(
				...createMessageEvent({
					sender: user.username,
					message: 'left the chat',
				}),
			);
			removeUser(user);
		});
	});

	return io;
};

attachSocketServerTo(server);

export default server;
