
import * as dotenv from 'dotenv';
dotenv.config();

import app from './src/app';
import {connectToDatabase} from './src/models';
import config from './src/utils/config';

const port = Number(config.port) || 3000;

const start = async () => {
	await connectToDatabase();

	app.listen(port, () => {
		console.log(`Express server listening on port ${port}`);
	});
};

void start();
