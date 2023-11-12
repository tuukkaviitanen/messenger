
import app from './src/app';
import {connectToDatabase} from './src/database';
import config from './src/utils/config';
import logger from './src/utils/logger';

const port = Number(config.port) || 3000;

const start = async () => {
	await connectToDatabase();

	app.listen(port, () => {
		logger.info(`Express server listening on port ${port}`);
	});
};

void start();
