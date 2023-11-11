import {Router as createRouter} from 'express';

import userService from '../services/userService';

const usersRouter = createRouter();

usersRouter.get('/:id', (req, res) => {
	const {id} = req.params;
	const user = userService.getSingle(id);

	if (!user) {
		return res.sendStatus(404);
	}

	return res.json(user);
});

export default usersRouter;
