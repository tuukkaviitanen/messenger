import {configureStore} from '@reduxjs/toolkit';

import userReducer from './reducers/userSlicer';
import socketReducer from './reducers/socketSlice';
import chatReducer from './reducers/chatSlice';

const store = configureStore({
	reducer: {user: userReducer, socket: socketReducer, chat: chatReducer},
	middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
