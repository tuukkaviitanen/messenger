import {ChatMessage} from '../entities/ChatMessage';
import {User} from '../entities/User';
import {type MessageContent, type Message} from '../utils/types';

const getAllByUser = async (userId: string) => {
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

export default {getAllByUser, create};
