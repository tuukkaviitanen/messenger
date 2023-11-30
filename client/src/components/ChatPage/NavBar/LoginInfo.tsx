import {Box, Button, Typography} from '@mui/material';
import {type UserWithToken} from '../../../validators/UserWithToken';
import {type StyleSheet} from '../../../utils/types';

const styles: StyleSheet = {
	text: {
		textAlign: 'center',
	},
	loginContainer: {
		display: 'flex',
		flexDirection: 'column',
	},
};

type Params = {
	currentUser?: UserWithToken;
	handleLogout: () => void;
};

const LoginInfo = ({currentUser, handleLogout}: Params) => (
	<Box sx={styles.loginContainer}>
		<Typography sx={styles.text} >Logged in as {currentUser?.username}</Typography>
		<Button variant='outlined' onClick={handleLogout}>
    Logout
		</Button>
	</Box>
);

export default LoginInfo;
