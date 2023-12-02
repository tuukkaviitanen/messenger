import connectionSource from '../../typeorm.config';
import logger from './logger';

export const createConnection = async () => {
	await connectionSource.initialize();
	logger.info('Database connection initialized');

	const migrations = await connectionSource.runMigrations();
	logger.info('Database migrations completed', {migrations: migrations.map(mig => mig.name)});
};

export const closeConnection = async () => {
	await connectionSource.destroy();
};

const db = {
	createConnection,
	closeConnection,
};

export default db;
