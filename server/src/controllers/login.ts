import {Router as createRouter} from 'express';
import {userCredentialsSchema} from '../validators/UserCredentials';
import userService from '../services/userService';

const loginRouter = createRouter();

loginRouter.post('/', async (req, res) => {
	const userCredentials = userCredentialsSchema.parse(req.body);

	const token = await userService.getToken(userCredentials);

	return res.json({token, username: userCredentials.username});
});

export default loginRouter;
