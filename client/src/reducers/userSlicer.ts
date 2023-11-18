import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {type UserWithToken} from '../validators/UserWithToken';
import {localStorageKeys} from '../utils/constants';

type InitialState = {
	currentUser: UserWithToken | undefined;
};

const initialState: InitialState = {
	currentUser: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setCurrentUser(state, action: PayloadAction<UserWithToken>) {
			window.localStorage.setItem(localStorageKeys.currentUser, JSON.stringify(action.payload));
			state.currentUser = action.payload;
		},
		removeCurrentUser(state) {
			window.localStorage.removeItem(localStorageKeys.currentUser);
			state.currentUser = null;
		},
	},
});

export const {setCurrentUser, removeCurrentUser} = userSlice.actions;

const userReducer = userSlice.reducer;

export default userReducer;
