import {useEffect} from 'react';
import Chat from './Chat';
import NavBar from './NavBar';
import {useAppDispatch, useAppSelector} from '../../hooks/typedReduxHooks';
import {closeConnection, startConnection} from '../../reducers/socketSlice';
import {type StyleSheet} from '../../utils/types';
import {Box} from '@mui/material';

const styles: StyleSheet = {
	container: {
		display: 'flex',
		height: '100%',
	},
};

const MainPage = () => {
	const user = useAppSelector(state => state.user.currentUser);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (user) {
			dispatch(startConnection({token: user.token}));
		}

		return () => {
			dispatch(closeConnection());
		};
	}, [user, dispatch]);

	return (
		<Box sx={styles.container}>
			<Chat />
			<NavBar />
		</Box>
	);
};

export default MainPage;
