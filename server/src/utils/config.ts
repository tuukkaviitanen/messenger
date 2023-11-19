import * as dotenv from 'dotenv';
import logger from './logger';
dotenv.config();

const port = Number(process.env.PORT) || 3000;

const jwtSecret = process.env.JWT_SECRET;

const postgresUrlProduction = process.env.POSTGRES_URL;

const postgresUrlTesting = process.env.POSTGRES_URL_TEST;

const nodeEnv = process.env.NODE_ENV;

const postgresUrl = (nodeEnv === 'test') ? postgresUrlTesting : postgresUrlProduction;

const clientDistPath = nodeEnv === 'development' ? '../../client/dist' : '../../../client/dist';

if (!jwtSecret || !postgresUrl || !nodeEnv) {
	logger.error('All required env variables are not set!');
	process.exit(1);
}

const config = {port, jwtSecret, postgresUrl, nodeEnv, clientDistPath};

export default config;
