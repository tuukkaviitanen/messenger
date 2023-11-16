import app from './app';
import {createServer} from 'node:http';
import {Server, type Socket} from 'socket.io';
import logger from './utils/logger';
import jwt from 'jsonwebtoken';
import config from './utils/config';
import {userPublicSchema} from './validators/UserPublic';

const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:5173',
	},
});

const parseUsernameFromToken = (token: string) => {
	const decodedToken: unknown = jwt.verify(token, config.jwtSecret);

	const user = userPublicSchema.parse(decodedToken);

	return user.username;
};

type SocketWithUsername = {
	username: string;
} & Socket;

io.use((socket, next) => {
	const {token} = socket.handshake.auth;

	if (typeof token !== 'string') {
		next(new Error('Token is required'));
		return;
	}

	try {
		(socket as SocketWithUsername).username = parseUsernameFromToken(token);
		next();
	} catch (ex) {
		next(new Error('Token invalid'));
	}
});

io.on('connection', socket => {
	logger.info(`user ${socket.id} connected`);

	socket.on('message', (message: string) => {
		logger.info(`message received from ${socket.id}`, message);
		io.emit('message', (socket as SocketWithUsername).username, message);
	});
});

export default server;
