import {type Server, type Socket} from 'socket.io';
import {type UserPublic} from '../../validators/UserPublic';
import userService from '../../services/userService';
import logger from '../../utils/logger';
import {SocketEvent, type MessageContent} from '../../utils/types';
import {User} from '../../entities/User';

const connectHandler = async (io: Server, socket: Socket, user: UserPublic) => {
	await socket.join(user.id);

	userService.setOnline(user);
	io.emit(SocketEvent.Users, {connectedUsers: userService.getAllOnline()});

	logger.log(`socket ${socket.id} connected as user ${user.username}`);

	socket.broadcast.emit(SocketEvent.ServerEvent, {
		message: `${user.username} joined the chat`,
		timestamp: new Date(),
	});
	socket.emit(SocketEvent.ServerEvent, {
		message: `Welcome to the messenger app. Users currently online: ${userService
			.getAllOnline()
			.map(u => u.username)
			.join(', ')}`,
		timestamp: new Date(),
	});

	const storedUser = await User.findOne({
		where: {id: user.id},
		relations: {messages: true},
	});

	// This parses the database entity into a DTO
	const messages: MessageContent[] = storedUser?.messages.map(message => ({
		message: message.content,
		timestamp: message.timestamp,
		sender: message.sender.username,
		recipients: message.recipients.map(r => ({
			id: r.id,
			username: r.username,
		})).filter(r => r.id !== user.id),
	})) ?? [];

	socket.emit(SocketEvent.RestoreMessages, {
		messages,
	});
};

export default connectHandler;
