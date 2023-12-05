import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {type Chat, type Message, type User} from '../utils/types';
import {usersArrayEqual} from '../utils/helpers';

type InitialState = {
	chats: Chat[];
	selectedChatIndex: number;
};

const initialState: InitialState = {
	chats: [{messages: []}],
	selectedChatIndex: 0,
};

type ChatPayload = {chat: Chat};

type MessagePayload = {recipients?: User[]; message: Message};

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		addChat(state, action: PayloadAction<ChatPayload>) {
			state.chats.push(action.payload.chat);
		},
		addMessage(state, action: PayloadAction<MessagePayload>) {
			const {recipients, message} = action.payload;

			const chat = state.chats.find(chat => usersArrayEqual(chat.recipients, recipients),
			);

			if (chat) {
				chat.messages.push(message);
			} else {
				state.chats.push({recipients, messages: [message]});
			}
		},
		setSelectedChatIndex(state, action: PayloadAction<number>) {
			state.selectedChatIndex = action.payload;
		},
		clearChats() {
			return initialState;
		},
	},
});

export const {addChat, addMessage, setSelectedChatIndex, clearChats} = chatSlice.actions;

const chatReducer = chatSlice.reducer;

export default chatReducer;
