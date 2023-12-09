import {Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './LoginPage';
import {Container} from '@mui/material';
import ChatPage from './ChatPage';

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useAppSelector} from '../hooks/typedReduxHooks';
import {localStorageKeys} from '../utils/constants';
import {useEffect} from 'react';
import {userWithTokenSchema} from '../validators/UserWithToken';
import {type StyleSheet} from '../utils/types';
import {useLoginUser} from '../hooks/loginHooks';
import toastifyConfig from '../../toastify.config';

const styles: StyleSheet = {
	container: {
		height: '100vh',
	},
};

const App = () => {
	const currentUser = useAppSelector(state => state.user.currentUser);

	const loginUser = useLoginUser();

	useEffect(() => {
		const localStorageUser = window.localStorage.getItem(
			localStorageKeys.currentUser,
		);
		if (!localStorageUser) {
			return;
		}

		const user = userWithTokenSchema.safeParse(JSON.parse(localStorageUser));

		if (!user.success) {
			toast.error('Saved user invalid');
			window.localStorage.removeItem(
				localStorageKeys.currentUser,
			);
			return;
		}

		loginUser(user.data);
	}, [loginUser]);

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
			<ToastContainer {...toastifyConfig}/>
		</>
	);
};

export default App;
