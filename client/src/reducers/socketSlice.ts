import {type PayloadAction, createSlice} from '@reduxjs/toolkit';
import {type Socket, io} from 'socket.io-client';

type SocketState = {
	connection: Socket | undefined;
};

const initialState: SocketState = {
	connection: null,
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
			const newSocket = io('http://localhost:3000', {auth: {token}});
			return {connection: newSocket};
		},
		closeConnection(state) {
			state.connection?.close();
			state.connection = null;
		},
	},
});

export const {startConnection, closeConnection} = socketSlice.actions;

const socketReducer = socketSlice.reducer;

export default socketReducer;
