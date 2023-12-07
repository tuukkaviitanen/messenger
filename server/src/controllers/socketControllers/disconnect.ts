import {type Server, type Socket} from 'socket.io';
import {type UserPublic} from '../../validators/UserPublic';
import logger from '../../utils/logger';
import {SocketEvent} from '../../utils/types';
import userService from '../../services/userService';

const disconnectHandler = (io: Server, socket: Socket, user: UserPublic) => {
	socket.on(SocketEvent.Disconnect, () => {
		logger.log(`${user.username} disconnected`);

		socket.broadcast.emit(
			SocketEvent.ServerEvent,
			{message: `${user.username} left the chat`, timestamp: new Date()},
		);

		userService.setOffline({...user, connectionId: socket.id});
		io.emit(SocketEvent.Users, {connectedUsers: userService.getAllOnline()});
	});
};

export default disconnectHandler;
