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
	await redis.client.multi()
		.rPush(redisKey, JSON.stringify(message))
		.expire(redisKey, 60 * 60) // 1 hour in seconds
		.exec();
};

const getAllCached = async () => {
	const messages = await redis.client.lRange(redisKey, 0, -1);

	const parsedMessages = messages
		.map(unparsedMessage => {
			const parseResults = messageContentStringTimestampSchema.safeParse(JSON.parse(unparsedMessage));

			return parseResults.success ? parseResults.data : null;
		})
		.filter(message => message !== null);

	return parsedMessages;
};

export default {getAllByUser, create, cache, getAllCached};
