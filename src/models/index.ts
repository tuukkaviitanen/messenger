import {Sequelize} from 'sequelize';
import initUser from './User';
import config from '../utils/config';

export const sequelize = new Sequelize(config.postgresUrl);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UserModel = initUser(sequelize);

export const connectToDatabase = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connected to database');

		await UserModel.sync();
	} catch (error) {
		console.error('Connecting to database failed!', error);
		return process.exit(1);
	}
};

