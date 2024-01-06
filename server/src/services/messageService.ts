import {ChatMessage} from '../entities/ChatMessage';
import {User} from '../entities/User';
import {type Message} from '../utils/types';
import {type MessageContent, messageContentStringTimestampSchema} from '../validators/MessageContent';
import redis from '../utils/redis';

const getAllByUser = async (userId: string): Promise<MessageContent[]> => {
	// This parses the database entity into a DTO

	const user = await User.findOne({
		where: {id: userId},
		relations: {messages: true},
	});

	if (!user) {
		throw new Error('User not found in database');
	}

	const messages: MessageContent[] = user.messages?.map(message => ({
		message: message.content,
		timestamp: message.timestamp,
		sender: message.sender.username,
		recipients: message.recipients.map(r => ({
			id: r.id,
			username: r.username,
		})).filter(r => r.id !== userId),
	})) ?? [];

	return messages;
};

const create = async (message: Message) => {
	const createdMessage = await ChatMessage.save({
		content: message.content,
		timestamp: message.timestamp,
		sender: {id: message.sender.id},
		recipients: message.recipients?.map(r => ({id: r.id})),
	});

	return createdMessage;
};

const redisKey = 'messages';

const cache = async (message: MessageContent) => {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	await redis.client.set(`${redisKey}:${message.timestamp.getTime()}`, JSON.stringify(message), {EX: 60 * 60}); // Set to expire in 1 hour
};

const getAllCached = async () => {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const {keys} = await redis.client.scan(0, {MATCH: `${redisKey}:*`, COUNT: 1000});

	if (keys.length === 0) {
		return [];
	}

	const messages = await redis.client.mGet(keys);

	const parsedMessages = messages
		.map(unparsedMessage => {
			if (!unparsedMessage) {
				return null;
			}

			const parseResults = messageContentStringTimestampSchema.safeParse(JSON.parse(unparsedMessage));

			return parseResults.success ? parseResults.data : null;
		})
		.filter(message => message !== null);

	return parsedMessages;
};

export default {getAllByUser, create, cache, getAllCached};
