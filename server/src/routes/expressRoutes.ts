import express, {Router as createRouter} from 'express';
import 'express-async-errors';
import usersRouter from '../controllers/expressControllers/users';
import {errorHandler, parseToken} from '../utils/middleware';
import loginRouter from '../controllers/expressControllers/login';
import path from 'path';
import config from '../utils/config';
import testingRouter from '../controllers/expressControllers/testing';
import logger from '../utils/logger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const clientDistPath = config.nodeEnv === 'development' ? '../../../client/dist' : '../../../../client/dist';

const expressRouter = createRouter();

expressRouter.use(helmet());

expressRouter.use(rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
	max: 100, // Max number of requests allowed in that time frame
}));

expressRouter.use(express.json());

expressRouter.use(parseToken);

expressRouter.use(express.static(path.join(__dirname, clientDistPath)));

expressRouter.use('/api/users', usersRouter);

expressRouter.use('/api/login', loginRouter);

expressRouter.get('/api/healthz', (req, res) => res.send('ok'));

if (config.nodeEnv === 'test') {
	expressRouter.use('/api/testing', testingRouter);
	logger.log('TESTING ROUTER IS ENABLED! THIS SHOULD ONLY BE THE CASE WHEN RUNNING ON A TEST DATABASE!');
}

expressRouter.use(errorHandler);

// Handles any requests that don't match the ones above
expressRouter.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, clientDistPath, 'index.html'));
});

export default expressRouter;
