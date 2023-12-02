import 'reflect-metadata'; // TypeORM requirement
import config from './src/utils/config';
import logger from './src/utils/logger';
import server from './src/server';
import db from './src/utils/db';

db.createConnection()
	.then(() => {
		server.listen(config.port, () => {
			logger.info(`Express server listening on port ${config.port}`);
		});
	})
	.catch(error => {
		logger.error('Database initialization failed', error);
	});
