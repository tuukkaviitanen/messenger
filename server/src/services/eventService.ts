import redis from '../utils/redis';
import {serverEventSchema, type ServerEvent} from '../validators/ServerEvent';

const redisKey = 'events';

const cache = async (event: ServerEvent) => {
	await redis.client.multi()
		.rPush(redisKey, JSON.stringify(event))
		.expire(redisKey, 60 * 60) // 1 hour in seconds
		.exec();
};

const getAllCached = async () => {
	const events = await redis.client.lRange(redisKey, 0, -1);

	const parsedEvents = events
		.map(unparsedEvent => {
			const parseResults = serverEventSchema.safeParse(JSON.parse(unparsedEvent));

			return parseResults.success ? parseResults.data : null;
		})
		.filter(event => event !== null);

	return parsedEvents;
};

export default {cache, getAllCached};
