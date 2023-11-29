import {connectToDatabase} from './src/database';
import config from './src/utils/config';
import logger from './src/utils/logger';
import server from './src/app';

const start = async () => {
	await connectToDatabase();

	server.listen(config.port, () => {
		logger.info(`Express server listening on port ${config.port}`);
	});
};

void start();
