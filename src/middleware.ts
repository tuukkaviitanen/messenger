import {type ErrorRequestHandler, type NextFunction, type Request, type Response} from 'express';
import {ZodError} from 'zod';
import {fromZodError} from 'zod-validation-error';
import {AuthenticationError} from './customErrors';
import jwt from 'jsonwebtoken';
import {userPublicSchema, type UserPublic} from './validators/UserPublic';
import {type RequestWithUser} from './types';

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
			const decodedToken: unknown = jwt.verify(token, process.env.JWT_SECRET!);

			const user = userPublicSchema.parse(decodedToken);

			req.user = user;
		} catch (error) {
			console.error(error);
			next(new AuthenticationError('Invalid Authorization header'));
		}
	}

	next();
};
