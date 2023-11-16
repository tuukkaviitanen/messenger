import { Box, Typography } from '@mui/material';
import { StyleSheet } from '../../utils/types';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const styles: StyleSheet = {
  header: {
    textAlign: 'center',
    my: 5
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: {xs: 'column', md: 'row'}
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
        <RegisterForm />
      </Box>
    </Box>
  );
};

export default Login;
