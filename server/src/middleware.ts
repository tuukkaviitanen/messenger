import {type ErrorRequestHandler, type NextFunction, type Request, type Response} from 'express';
import {ZodError} from 'zod';
import {fromZodError} from 'zod-validation-error';
import {AuthenticationError} from './customErrors';
import jwt from 'jsonwebtoken';
import {userPublicSchema, type UserPublic} from './validators/UserPublic';
import {type RequestWithUser} from './types';
import config from './utils/config';
import {UniqueConstraintError} from 'sequelize';

export const errorHandler: ErrorRequestHandler = (error: unknown, req, res, next) => {
	if (error instanceof ZodError) {
		const {message} = fromZodError(error);
		console.error(message);
		return res.status(400).json({error: message});
	}

	if (error instanceof AuthenticationError) {
		console.error(error.message);
		return res.status(401).json({error: error.message});
	}

	if (error instanceof UniqueConstraintError) {
		const fieldKeys = Object.keys(error.fields);

		const errorMessages = fieldKeys.map(key => `${key} '${error.fields[key] as string}' is already in use`);

		console.error(errorMessages);
		return res.status(400).json({error: errorMessages.join(', ')});
	}

	if (error instanceof Error) {
		console.error(error.message);
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
			console.error(error);
			next(new AuthenticationError('Invalid Authorization header'));
		}
	}

	next();
};
