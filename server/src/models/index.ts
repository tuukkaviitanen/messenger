import {Sequelize} from 'sequelize';
import initUser from './User';
import config from '../utils/config';
import logger from '../utils/logger';

export const sequelize = new Sequelize(config.postgresUrl, {logging: logger.info});

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UserModel = initUser(sequelize);

export const connectToDatabase = async () => {
	try {
		await sequelize.authenticate();
		logger.info('Connected to database');

		await UserModel.sync();
	} catch (error) {
		logger.error('Connecting to database failed!', error);
		return process.exit(1);
	}
};

