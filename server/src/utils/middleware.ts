import {type ErrorRequestHandler, type NextFunction, type Response} from 'express';
import {ZodError} from 'zod';
import {fromZodError} from 'zod-validation-error';
import {AuthenticationError} from './customErrors';
import jwt from 'jsonwebtoken';
import {userPublicSchema} from '../validators/UserPublic';
import {type SocketWithUser, type RequestWithUser} from './types';
import config from './config';
import logger from './logger';
import {type Socket} from 'socket.io';
import {QueryFailedError} from 'typeorm';

export const errorHandler: ErrorRequestHandler = (error: unknown, req, res, next) => {
	if (error instanceof ZodError) {
		const {message} = fromZodError(error);
		logger.log(message);
		return res.status(400).json({error: message});
	}

	if (error instanceof AuthenticationError) {
		logger.log(error.message);
		return res.status(401).json({error: error.message});
	}

	if (error instanceof QueryFailedError && error.message.includes('unique')) {
		logger.log(error.driverError);
		return res.status(400).json({error: error.driverError.detail as string});
	}

	if (error instanceof QueryFailedError) {
		logger.error(error);
		return res.status(500).json({error: error.message});
	}

	if (error instanceof Error) {
		logger.error(error);
		return res.status(500).json({error: error.message});
	}

	next(error);
};

const parseUserFromToken = (token: string) => {
	const decodedToken: unknown = jwt.verify(token, config.secret);

	const user = userPublicSchema.parse(decodedToken);

	return user;
};

export const parseToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.replace(/^bearer /i, '');

	if (token) {
		try {
			const user = parseUserFromToken(token);

			req.user = user;
		} catch (error) {
			logger.error(error);
			next(new AuthenticationError('Invalid Authorization header'));
		}
	}

	next();
};

export const tokenParserMiddleware = (socket: Socket, next: (err?: Error) => void) => {
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
};
