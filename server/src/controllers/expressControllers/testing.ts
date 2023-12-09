import {Router as createRouter} from 'express';
import {User} from '../../entities/User';
import {userPublicSchema} from '../../validators/UserPublic';
import userService from '../../services/userService';
import {ChatMessage} from '../../entities/ChatMessage';
import logger from '../../utils/logger';
import redis from '../../utils/redis';

const testingRouter = createRouter();

testingRouter.delete('/clearDatabase', async (req, res) => {
	logger.info('/clearDatabase endpoint called');

	userService.clearAllOnlineUsers();

	await ChatMessage.delete({});
	await User.delete({});

	await redis.clear();

	return res.sendStatus(204);
});

testingRouter.post('/setUserOnline', async (req, res) => {
	logger.info('/setUserOnline endpoint called', req.body);

	const user = userPublicSchema.parse(req.body);

	userService.setOnline({...user, connectionId: 'mock-socket-id'});
	return res.sendStatus(204);
});

export default testingRouter;
