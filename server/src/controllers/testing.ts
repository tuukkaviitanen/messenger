import {Router as createRouter} from 'express';
import {userTable} from '../database';

const testingRouter = createRouter();

testingRouter.delete('/clearDatabase', async (req, res) => {
	await userTable.destroy({truncate: true});
	return res.sendStatus(204);
});

export default testingRouter;
