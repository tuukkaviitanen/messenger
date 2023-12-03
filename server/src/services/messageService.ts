import {ChatMessage} from '../entities/ChatMessage';
import {User} from '../entities/User';
import {type Message} from '../utils/types';

const getAllByUser = async (userId: string) => {
	const messages = await ChatMessage.find({where: {id: userId}});

	return messages;
};

const create = async (message: Message) => {
	const sender = await User.findOneBy({id: message.sender.id});

	const createdMessage = await ChatMessage.save({
		content: message.content,
		timestamp: message.timestamp,
		sender: {id: message.sender.id},
		recipients: message.recipients?.map(r => ({id: r.id})),
	});

	return createdMessage;
};

export default {getAllByUser, create};