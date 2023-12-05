import {useCallback} from 'react';
import {removeCurrentUser, setCurrentUser} from '../reducers/userSlicer';
import {localStorageKeys} from '../utils/constants';
import {type UserWithToken} from '../validators/UserWithToken';
import {useAppDispatch} from './typedReduxHooks';

export const useLogoutUser = () => {
	const dispatch = useAppDispatch();

	const logoutUser = useCallback(() => {
		window.localStorage.removeItem(localStorageKeys.currentUser);
		dispatch(removeCurrentUser());
	}, [dispatch]);

	return logoutUser;
};

export const useLoginUser = () => {
	const dispatch = useAppDispatch();

	const loginUser = useCallback((user: UserWithToken) => {
		window.localStorage.setItem(localStorageKeys.currentUser, JSON.stringify(user));
		dispatch(setCurrentUser(user));
	}, [dispatch]);

	return loginUser;
};
