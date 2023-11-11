import {type Request} from 'express';
import {type UserPublic} from './validators/UserPublic';

export type RequestWithUser = {
	user?: UserPublic;
} & Request;
