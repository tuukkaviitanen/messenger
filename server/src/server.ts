import app from './app';
import {createServer, type Server as HttpServer} from 'node:http';
import {Server, type Socket} from 'socket.io';
import logger from './utils/logger';
import jwt from 'jsonwebtoken';
import config from './utils/config';
import {type UserPublic, userPublicSchema} from './validators/UserPublic';

const server = createServer(app);

export const attachSocketServerTo = (httpServer: HttpServer) => {
	const io = new Server(httpServer);

	const parseUserFromToken = (token: string) => {
		const decodedToken: unknown = jwt.verify(token, config.jwtSecret);

		const user = userPublicSchema.parse(decodedToken);

		return user;
	};

	type SocketWithUser = {
		user: UserPublic;
	} & Socket;

	let connectedUsers: UserPublic[] = [];

	io.use((socket, next) => {
		const {token} = socket.handshake.auth;

		if (!token) {
			next(new Error('Token is required'));
			return;
		}

		if (typeof token !== 'string') {
			next(new Error('Token in invalid format'));
			return;
		}

		try {
			(socket as SocketWithUser).user = parseUserFromToken(token);
			next();
		} catch (ex) {
			next(new Error('Token invalid'));
		}
	});

	enum SocketEvent {
		Connection = 'connection',
		Disconnect = 'disconnect',
		Message = 'message',
	}

	type MessageContent = {
		sender: string;
		message: string;
		timestamp: Date;
	};

	io.on(SocketEvent.Connection, async socket => {
		const {user} = (socket as SocketWithUser);
		await socket.join(user.id);

		connectedUsers = connectedUsers.find(u => u.id === user.id) === undefined ? connectedUsers.concat(user) : connectedUsers;

		logger.info(`socket ${socket.id} connected as user ${user.username}`);
		socket.broadcast.emit(SocketEvent.Message, {sender: user.username, message: 'joined the chat', timestamp: new Date()});
		socket.emit(SocketEvent.Message, {sender: 'server', message: `Welcome to the messenger app. Users currently online: ${connectedUsers.map(u => u.username).join(', ')}`, timestamp: new Date()});

		socket.on(SocketEvent.Message, (message: string) => {
			logger.info(`message received from ${socket.id}`, message);
			io.emit(SocketEvent.Message, {sender: user.username, message, timestamp: new Date()});
		});

		socket.on(SocketEvent.Disconnect, () => {
			logger.info(`${user.username} disconnected`);
			socket.broadcast.emit(SocketEvent.Message, {sender: user.username, message: 'left the chat', timestamp: new Date()});
			connectedUsers = connectedUsers.filter(u => u.id !== user.id);
		});
	});

	return io;
};

attachSocketServerTo(server);

export default server;
