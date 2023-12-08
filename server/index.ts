import 'reflect-metadata'; // TypeORM requirement
import config from './src/utils/config';
import logger from './src/utils/logger';
import server from './src/server';
import db from './src/utils/db';
import redis from './src/utils/redis';

const start = async () => {
	try {
		await db.createConnection();
	} catch (error) {
		logger.error('Database initialization failed', error);
		process.exit(1);
	}

	try {
		await redis.createConnection();
	} catch (error) {
		logger.error('Redis initialization failed', error);
		process.exit(1);
	}

	server.listen(config.port, () => {
		logger.info(`Express server listening on port ${config.port}`);
	});
};

void start();
