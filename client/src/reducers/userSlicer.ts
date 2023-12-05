import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {type UserWithToken} from '../validators/UserWithToken';

type InitialState = {
	currentUser?: UserWithToken;
};

const initialState: InitialState = {
	currentUser: undefined,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setCurrentUser(state, action: PayloadAction<UserWithToken>) {
			state.currentUser = action.payload;
		},
		removeCurrentUser(state) {
			state.currentUser = undefined;
		},
	},
});

export const {setCurrentUser, removeCurrentUser} = userSlice.actions;

const userReducer = userSlice.reducer;

export default userReducer;
