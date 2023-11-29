import express from 'express';
import 'express-async-errors';
import usersRouter from '../controllers/users';
import {errorHandler, parseToken} from '../utils/middleware';
import loginRouter from '../controllers/login';
import path from 'path';
import config from '../utils/config';
import testingRouter from '../controllers/testing';
import logger from '../utils/logger';

const clientDistPath = config.nodeEnv === 'development' ? '../../../client/dist' : '../../../../client/dist';

const app = express();
app.use(express.json());

app.use(parseToken);

app.use(express.static(path.join(__dirname, clientDistPath)));

app.use('/api/users', usersRouter);

app.use('/api/login', loginRouter);

app.get('/api/healthz', (req, res) => res.send('ok'));

if (config.nodeEnv === 'test') {
	app.use('/api/testing', testingRouter);
	logger.log('TESTING ROUTER IS ENABLED! THIS SHOULD ONLY BE THE CASE WHEN RUNNING ON A TEST DATABASE!');
}

app.use(errorHandler);

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, clientDistPath, 'index.html'));
});

export default app;
