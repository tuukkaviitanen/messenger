import {Button, Paper, Typography} from '@mui/material';
import {removeCurrentUser} from '../../reducers/userSlicer';
import {useAppDispatch, useAppSelector} from '../../hooks/typedReduxHooks';
import {type StyleSheet} from '../../utils/types';

const styles: StyleSheet = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		p: 1,
		m: 1,
		flexGrow: 1,
		overflow: 'auto',
	},
	text: {
		textAlign: 'center',
	},
};

const NavBar = () => {
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(state => state.user.currentUser);

	const handleLogout = () => {
		dispatch(removeCurrentUser());
	};

	return (
		<Paper elevation={10} sx={styles.container}>
			<Typography sx={styles.text} >Logged in as {currentUser?.username}</Typography>
			<Button variant='outlined' onClick={handleLogout}>
        Logout
			</Button>
		</Paper>
	);
};

export default NavBar;
