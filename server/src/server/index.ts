import app from './express';
import {attachSocketServerTo} from './sockets';
import {createServer} from 'node:http';

const server = createServer(app);
attachSocketServerTo(server);

export default server;
