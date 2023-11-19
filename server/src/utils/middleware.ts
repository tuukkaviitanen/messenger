import {type ErrorRequestHandler, type NextFunction, type Response} from 'express';
import {ZodError} from 'zod';
import {fromZodError} from 'zod-validation-error';
import {AuthenticationError} from './customErrors';
import jwt from 'jsonwebtoken';
import {userPublicSchema} from '../validators/UserPublic';
import {type RequestWithUser} from './types';
import config from './config';
import {DatabaseError, UniqueConstraintError} from 'sequelize';
import logger from './logger';

export const errorHandler: ErrorRequestHandler = (error: unknown, req, res, next) => {
	if (error instanceof ZodError) {
		const {message} = fromZodError(error);
		logger.info(message);
		return res.status(400).json({error: message});
	}

	if (error instanceof AuthenticationError) {
		logger.info(error.message);
		return res.status(401).json({error: error.message});
	}

	if (error instanceof UniqueConstraintError) {
		const fieldKeys = Object.keys(error.fields);

		const errorMessages = fieldKeys.map(key => `${key} '${error.fields[key] as string}' is already in use`);

		logger.info(errorMessages);
		return res.status(400).json({error: errorMessages.join(', ')});
	}

	if (error instanceof DatabaseError) {
		logger.error(error.message);
		return res.status(500).json({error: error.message});
	}

	if (error instanceof Error) {
		logger.error(error.message);
		return res.status(500).json({error: error.message});
	}

	next(error);
};

export const parseToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.replace(/^bearer /i, '');

	if (token) {
		try {
			const decodedToken: unknown = jwt.verify(token, config.jwtSecret);

			const user = userPublicSchema.parse(decodedToken);

			req.user = user;
		} catch (error) {
			logger.error(error);
			next(new AuthenticationError('Invalid Authorization header'));
		}
	}

	next();
};
