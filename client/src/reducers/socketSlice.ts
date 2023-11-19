import {type PayloadAction, createSlice} from '@reduxjs/toolkit';
import {type Socket, io} from 'socket.io-client';

type SocketState = {
	connection?: Socket;
};

const initialState: SocketState = {
	connection: undefined,
};

type Payload = {
	token: string;
};

const socketSlice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		startConnection(_state, action: PayloadAction<Payload>) {
			const {token} = action.payload;
			const newSocket = io({auth: {token}});
			return {connection: newSocket};
		},
		closeConnection(state) {
			state.connection?.close();
			state.connection = undefined;
		},
	},
});

export const {startConnection, closeConnection} = socketSlice.actions;

const socketReducer = socketSlice.reducer;

export default socketReducer;
