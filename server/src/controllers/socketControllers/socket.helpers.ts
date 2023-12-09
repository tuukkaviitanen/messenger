import {type Socket} from 'socket.io';
import messageService from '../../services/messageService';
import {SocketEvent} from '../../utils/types';
import logger from '../../utils/logger';
import {type UserPublic} from '../../validators/UserPublic';
import eventService from '../../services/eventService';
import {type ServerEvent} from '../../validators/ServerEvent';

export const saveMessageToCache = async (socket: Socket, message: string, senderName: string) => {
	try {
		await messageService.cache({message, sender: senderName, timestamp: new Date()});
	} catch (error) {
		socket.emit(SocketEvent.Error, {error});
		logger.error('Error while saving message to cache', error);
	}
};

export const saveEventToCache = async (socket: Socket, event: ServerEvent) => {
	try {
		await eventService.cache(event);
	} catch (error) {
		socket.emit(SocketEvent.Error, {error});
		logger.error('Error while saving event to cache', error);
	}
};

export const saveMessageToDatabase = async (socket: Socket, message: string, user: UserPublic, recipients: UserPublic[]) => {
	try {
		await messageService.create({content: message, sender: user, timestamp: new Date(), recipients});
	} catch (error) {
		socket.emit(SocketEvent.Error, {error});
		logger.error('Error while saving message', error);
	}
};

export const sendStoredMessages = async (socket: Socket, user: UserPublic) => {
	try {
		const privateMessages = await messageService.getAllByUser(user.id);
		const cachedGlobalMessages = await messageService.getAllCached();
		socket.emit(SocketEvent.RestoreMessages, {
			messages: [...cachedGlobalMessages, ...privateMessages],
		});
	} catch (error) {
		logger.error('Error getting messages!', error);
	}
};

export const sendStoredEvents = async (socket: Socket) => {
	try {
		const cachedEvents = await eventService.getAllCached();
		socket.emit(SocketEvent.RestoreEvents, {
			events: cachedEvents,
		});
	} catch (error) {
		logger.error('Error getting events!', error);
	}
};
