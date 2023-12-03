import {type Server, type Socket} from 'socket.io';
import {type UserPublic} from '../../validators/UserPublic';
import userService from '../../services/userService';
import logger from '../../utils/logger';
import {SocketEvent} from '../../utils/types';

const connectHandler = async (io: Server, socket: Socket, user: UserPublic) => {
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
};

export default connectHandler;