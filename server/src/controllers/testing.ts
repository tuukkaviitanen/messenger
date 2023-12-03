import {Router as createRouter} from 'express';
import {User} from '../entities/User';
import {userPublicSchema} from '../validators/UserPublic';
import userService from '../services/userService';
import {ChatMessage} from '../entities/ChatMessage';
import logger from '../utils/logger';

const testingRouter = createRouter();

testingRouter.delete('/clearDatabase', async (req, res) => {
	logger.info('/clearDatabase endpoint called');

	userService.clearAllOnlineUsers();

	await ChatMessage.delete({});
	await User.delete({});
	return res.sendStatus(204);
});

testingRouter.post('/setUserOnline', async (req, res) => {
	logger.info('/setUserOnline endpoint called', req.body);

	const user = userPublicSchema.parse(req.body);

	userService.setOnline(user);
	return res.sendStatus(204);
});

export default testingRouter;
