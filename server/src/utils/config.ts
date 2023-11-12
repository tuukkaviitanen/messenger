import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT;

const jwtSecret = process.env.JWT_SECRET;

const postgresUrl = process.env.POSTGRES_URL;

if (!jwtSecret || !postgresUrl) {
	console.error('All required env variables are not set!');
	process.exit(1);
}

const config = {port, jwtSecret, postgresUrl};

export default config;
