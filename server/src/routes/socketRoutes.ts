import {type Server as HttpServer} from 'node:http';
import {Server} from 'socket.io';
import {tokenParserMiddleware} from '../utils/middleware';
import {SocketEvent, type SocketWithUser} from '../utils/types';
import messageHandler from '../controllers/socketControllers/message';
import disconnectHandler from '../controllers/socketControllers/disconnect';
import connectHandler from '../controllers/socketControllers/connect';

export const attachSocketServerTo = (httpServer: HttpServer) => {
	const io = new Server(httpServer);

	io.use(tokenParserMiddleware);

	io.on(SocketEvent.Connection, async socket => {
		const {user} = socket as SocketWithUser;

		await connectHandler(io, socket, user);

		messageHandler(io, socket, user);

		disconnectHandler(io, socket, user);
	});

	return io;
};
