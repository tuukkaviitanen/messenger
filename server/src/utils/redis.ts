import * as Redis from 'redis';
import logger from './logger';
import config from './config';

const client = Redis.createClient({url: config.redisUrl});

client.on('error', err => {
	logger.error('Redis Client Error', err);
});

export const createConnection = async () => {
	await client.connect();
};

export const closeConnection = async () => {
	await client.disconnect();
};

export const clear = async () => {
	await client.flushAll(Redis.RedisFlushModes.ASYNC);
};

const redis = {client, createConnection, closeConnection, clear};

export default redis;
