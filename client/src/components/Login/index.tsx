import { Box, Typography } from '@mui/material';
import { StyleSheet } from '../../utils/types';
import LoginForm from './LoginForm';

const styles: StyleSheet = {
  header: {
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
};

const Login = () => {
  return (
    <Box>
      <Typography variant='h2' sx={styles.header}>
        Welcome to messenger
      </Typography>
      <Box sx={styles.container}>
        <LoginForm />
        <LoginForm />
      </Box>
    </Box>
  );
};

export default Login;
