import redis from '../utils/redis';
import {serverEventSchema, type ServerEvent} from '../validators/ServerEvent';

const redisKey = 'events';

const cache = async (event: ServerEvent) => {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	await redis.client.set(`${redisKey}:${event.timestamp.valueOf()}`, JSON.stringify(event), {EX: 60 * 60}); // Set to expire in 1 hour
};

const getAllCached = async () => {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const {keys} = await redis.client.scan(0, {MATCH: `${redisKey}:*`, COUNT: 1000});

	if (keys.length === 0) {
		return [];
	}

	const events = await redis.client.mGet(keys);

	const parsedEvents = events
		.map(unparsedEvent => {
			if (!unparsedEvent) {
				return null;
			}

			const parseResults = serverEventSchema.safeParse(JSON.parse(unparsedEvent));

			return parseResults.success ? parseResults.data : null;
		})
		.filter(event => event !== null);

	return parsedEvents;
};

export default {cache, getAllCached};
