import {type Request} from 'express';
import {type UserPublic} from '../validators/UserPublic';
import {type Socket} from 'socket.io';

export type RequestWithUser = {
	user?: UserPublic;
} & Request;

export type SocketWithUser = {
	user: UserPublic;
} & Socket;

export type Message = {
	content: string;
	sender: UserPublic;
	timestamp: Date;
	recipients?: UserPublic[];
};

export enum SocketEvent {
	Connection = 'connection',
	Disconnect = 'disconnect',
	Message = 'message',
	Users = 'users',
	ServerEvent = 'server-event',
}

export type MessageContent = {
	sender: string;
	message: string;
	recipients?: UserPublic[];
	timestamp: Date;
};
