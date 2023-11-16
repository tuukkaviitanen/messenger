import app from './app';
import {createServer} from 'node:http';
import {Server} from 'socket.io';
import logger from './utils/logger';

const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
});

io.on('connection', socket => {
	socket.on('message', () => {
		logger.info(`message recieved from ${socket.id}`);
	});
});

export default server;
