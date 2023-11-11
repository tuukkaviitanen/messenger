import {Router as createRouter} from 'express';

import userService from '../services/userService';
import {userCredentialsSchema} from '../validators/UserCredentials';
import {type RequestWithUser} from '../types';

const usersRouter = createRouter();

usersRouter.get('/:id', async (req, res) => {
	const {id} = req.params;
	const user = await userService.getSingle(id);

	if (!user) {
		return res.sendStatus(404);
	}

	return res.json(user);
});

usersRouter.post('/', async (req, res) => {
	const userCredentials = userCredentialsSchema.parse(req.body);

	const user = await userService.create(userCredentials);

	return res.json(user);
});

export default usersRouter;
