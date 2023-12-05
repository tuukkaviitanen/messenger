import {type Server, type Socket} from 'socket.io';
import {type MessageContent, SocketEvent} from '../../utils/types';
import messageService from '../../services/messageService';
import {type UserPublic} from '../../validators/UserPublic';
import logger from '../../utils/logger';

const createMessageEvent = (
	content: Omit<MessageContent, 'timestamp'>,
): [string, MessageContent] => [SocketEvent.Message, {...content, timestamp: new Date()}];

const saveMessageToDatabase = async (socket: Socket, message: string, user: UserPublic, recipients: UserPublic[]) => {
	try {
		await messageService.create({content: message, sender: user, timestamp: new Date(), recipients});
	} catch (error) {
		socket.emit(SocketEvent.Error, {error});
		logger.error('Error while saving message', error);
	}
};

const messageHandler = (io: Server, socket: Socket, user: UserPublic) => {
	socket.on(SocketEvent.Message, async ({message, recipients}: {message: string; recipients?: UserPublic[]}) => {
		if (recipients) {
			recipients.push(user);

			// Awaiting database calls will block the event from finishing
			void saveMessageToDatabase(socket, message, user, recipients);

			recipients.forEach(recipient =>
				io.to(recipient.id).emit(
					...createMessageEvent({
						sender: user.username,
						message,
						recipients: [...recipients.filter(r => r.id !== recipient.id)],
					}),
				),
			);
		} else {
			io.emit(
				...createMessageEvent({
					sender: user.username,
					message,
				}),
			);
		}
	});
};

export default messageHandler;
