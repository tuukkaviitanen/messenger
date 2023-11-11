import {type ErrorRequestHandler} from 'express';
import {ZodError} from 'zod';
import {fromZodError} from 'zod-validation-error';
import {AuthenticationError} from './customErrors';

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
