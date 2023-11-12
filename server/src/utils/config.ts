import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT;

const jwtSecret = process.env.JWT_SECRET;

const postgresUrlProduction = process.env.POSTGRES_URL;

const postgresUrlTesting = process.env.POSTGRES_URL_TEST;

const nodeEnv = process.env.NODE_ENV;

const postgresUrl = (nodeEnv === 'test') ? postgresUrlTesting : postgresUrlProduction;

if (!jwtSecret || !postgresUrl || !nodeEnv) {
	console.error('All required env variables are not set!');
	process.exit(1);
}

const config = {port, jwtSecret, postgresUrl};

export default config;
