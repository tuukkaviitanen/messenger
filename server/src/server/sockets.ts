import {type Server as HttpServer} from 'node:http';
import {Server} from 'socket.io';
import logger from '../utils/logger';
import {type UserPublic} from '../validators/UserPublic';
import {tokenParserMiddleware} from '../utils/middleware';
import {type SocketWithUser} from '../utils/types';
import messageService from '../services/messageService';
import userService from '../services/userService';

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

	io.on(SocketEvent.Connection, async socket => {
		const {user} = socket as SocketWithUser;
		await socket.join(user.id);

		userService.setOnline(user);
		io.emit(SocketEvent.Users, {connectedUsers: userService.getAllOnline()});

		logger.log(`socket ${socket.id} connected as user ${user.username}`);
		socket.broadcast.emit(
			SocketEvent.ServerEvent,
			{message: `${user.username} joined the chat`, timestamp: new Date()},
		);
		socket.emit(
			SocketEvent.ServerEvent,
			{
				message: `Welcome to the messenger app. Users currently online: ${userService.getAllOnline()
					.map(u => u.username)
					.join(', ')}`,
				timestamp: new Date(),
			});

		socket.on(SocketEvent.Message, ({message, recipients}: {message: string; recipients?: UserPublic[]}) => {
			if (recipients) {
				recipients.push(user);
				void messageService.create({content: message, sender: user, timestamp: new Date(), recipients});
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
			userService.setOffline(user);
			io.emit(SocketEvent.Users, {connectedUsers: userService.getAllOnline()});
		});
	});

	return io;
};
