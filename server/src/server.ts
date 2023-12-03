import express from 'express';
import expressRouter from './routes/expressRoutes';
import {createServer} from 'node:http';
import {attachSocketServerTo} from './routes/socketRoutes';

const app = express();

app.use(expressRouter);

export {app};

const server = createServer(app);
attachSocketServerTo(server);

export default server;
