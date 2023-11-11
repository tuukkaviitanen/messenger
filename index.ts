
import * as dotenv from 'dotenv';
dotenv.config();

import app from './src/app';
import {connectToDatabase} from './src/models';

const port = Number(process.env.PORT) || 3000;

const start = async () => {
	await connectToDatabase();

	app.listen(port, () => {
		console.log(`Express server listening on port ${port}`);
	});
};

void start();
