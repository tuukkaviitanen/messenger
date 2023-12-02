import {Router as createRouter} from 'express';
import {User} from '../entities/User';

const testingRouter = createRouter();

testingRouter.delete('/clearDatabase', async (req, res) => {
	await User.delete({});
	return res.sendStatus(204);
});

export default testingRouter;
