import {type SxProps} from '@mui/material';

export type StyleSheet = Record<string, SxProps>;

export type UserCredentials = {
	username: string;
	password: string;
};

export type User = {
	id: string;
	username: string;
};

export type ExpectedAxiosErrorResponse = {
	error: string;
};

export type Message = {
	sender: string;
	message: string;
	timestamp: Date;
};

export enum SocketEvent {
	Message = 'message',
	ConnectionError = 'connect_error',
	Users = 'users',
	ServerEvent = 'server-event',
	RestoreMessages = 'restore-messages',
}

export type Chat = {
	recipients?: User[];
	messages: Message[];
};
