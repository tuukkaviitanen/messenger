import app from './app';
import {createServer} from 'node:http';
import {Server, type Socket} from 'socket.io';
import logger from './utils/logger';
import jwt from 'jsonwebtoken';
import config from './utils/config';
import {type UserPublic, userPublicSchema} from './validators/UserPublic';

const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:5173',
	},
});

const parseUserFromToken = (token: string) => {
	const decodedToken: unknown = jwt.verify(token, config.jwtSecret);

	const user = userPublicSchema.parse(decodedToken);

	return user;
};

type SocketWithUser = {
	user: UserPublic;
} & Socket;

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

io.on('connection', async socket => {
	const {user} = (socket as SocketWithUser);
	await socket.join(user.id);

	logger.info(`socket ${socket.id} connected as user ${user.username}`);
	socket.broadcast.emit('message', user.username, 'joined the chat');

	socket.on('message', (message: string) => {
		logger.info(`message received from ${socket.id}`, message);
		io.emit('message', user.username, message);
	});

	socket.on('disconnect', () => {
		logger.info(`${user.username} disconnected`);
		socket.broadcast.emit('message', user.username, 'left the chat');
	});
});

export default server;
