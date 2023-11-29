import {Sequelize} from 'sequelize';
import initUserTable from './models/User';
import config from '../utils/config';
import logger from '../utils/logger';
import {Umzug, SequelizeStorage} from 'umzug';

export const sequelize = new Sequelize(config.postgresUrl, {logging: logger.log});

const umzug = new Umzug({
	migrations: {glob: 'migrations/*.ts'},
	context: sequelize.getQueryInterface(),
	storage: new SequelizeStorage({sequelize, tableName: 'migrations'}),
	logger,
});

const runMigrations = async () => {
	const migrations = await umzug.up();

	if (migrations.length > 0) {
		logger.info('database migrations completed', {files: migrations.map(mig => mig.name)});
	} else {
		logger.info('database migrations already up to date');
	}
};

export const userTable = initUserTable(sequelize);

export const connectToDatabase = async () => {
	try {
		await sequelize.authenticate();
		logger.log('Connected to database');
		await runMigrations();
		logger.log('Database connection is ready');
	} catch (error) {
		logger.error('Connecting to database failed!', error);
		return process.exit(1);
	}
};
