import {Router as createRouter} from 'express';

import userService from '../services/userService';
import {userCredentialsSchemaWithMinMax} from '../validators/UserCredentials';

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
	const userCredentials = userCredentialsSchemaWithMinMax.parse(req.body);

	const user = await userService.create(userCredentials);

	return res.status(201).json(user);
});

export default usersRouter;
