import {Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './LoginPage';
import {Container} from '@mui/material';
import ChatPage from './ChatPage';

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useAppDispatch, useAppSelector} from '../hooks/typedReduxHooks';
import {localStorageKeys} from '../utils/constants';
import {useEffect} from 'react';
import {userWithTokenSchema} from '../validators/UserWithToken';
import {setCurrentUser} from '../reducers/userSlicer';
import {type StyleSheet} from '../utils/types';

const styles: StyleSheet = {
	container: {
		height: '100vh',
	},
};

const App = () => {
	const currentUser = useAppSelector(state => state.user.currentUser);

	const dispatch = useAppDispatch();

	useEffect(() => {
		const localStorageUser = window.localStorage.getItem(
			localStorageKeys.currentUser,
		);
		if (!localStorageUser) {
			return;
		}

		const user = userWithTokenSchema.safeParse(JSON.parse(localStorageUser));

		if (!user.success) {
			console.error('Parsed user invalid');
			return;
		}

		dispatch(setCurrentUser(user.data));
	}, [dispatch]);

	return (
		<>
			<Container sx={styles.container}>
				<Routes>
					<Route
						path='/login'
						element={currentUser ? <Navigate to='/' replace /> : <LoginPage />}
					/>
					<Route
						path='/*'
						element={
							currentUser ? <ChatPage /> : <Navigate to='/login' replace />
						}
					/>
					<Route path='*' element={<Navigate to='/' replace />} />
				</Routes>
			</Container>
			<ToastContainer position='top-center' />
		</>
	);
};

export default App;
