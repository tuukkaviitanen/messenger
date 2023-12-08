import {type Server, type Socket} from 'socket.io';
import {SocketEvent} from '../../utils/types';
import {type UserPublic} from '../../validators/UserPublic';
import {type MessageContent} from '../../validators/MessageContent';
import {saveMessageToCache, saveMessageToDatabase} from './socket.helpers';

const createMessageEvent = (
	content: Omit<MessageContent, 'timestamp'>,
): [string, MessageContent] => [SocketEvent.Message, {...content, timestamp: new Date()}];

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
			// Awaiting database calls will block the event from finishing
			void saveMessageToCache(socket, message, user.username);

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
