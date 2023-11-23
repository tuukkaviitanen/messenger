import {Sequelize} from 'sequelize';
import initUserTable from './models/User';
import config from '../utils/config';
import logger from '../utils/logger';

export const sequelize = new Sequelize(config.postgresUrl, {logging: logger.log});

export const userTable = initUserTable(sequelize);

export const connectToDatabase = async () => {
	try {
		await sequelize.authenticate();
		logger.log('Connected to database');

		await userTable.sync();
	} catch (error) {
		logger.error('Connecting to database failed!', error);
		return process.exit(1);
	}
};

