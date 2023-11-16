import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  SxProps,
  Typography,
} from '@mui/material';

type SxPropsStyles = Record<string, SxProps>;

const styles: SxPropsStyles = {
  container: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'center',
  },
  formControl: {
    m: { xs: 1, md: 5 },
  },
  header: {
    textAlign: 'center',
  },
  button: {
    p: 2
  }
};

const Login = () => {
  return (
    <Box>
      <Typography variant='h2' sx={styles.header}>
        Login to messenger
      </Typography>
      <form>
        <Box sx={styles.container}>
          <FormControl sx={styles.formControl}>
            <InputLabel>Username</InputLabel>
            <Input />
          </FormControl>
          <FormControl sx={styles.formControl}>
            <InputLabel>Password</InputLabel>
            <Input />
          </FormControl>
          <Button variant='contained' sx={styles.formControl}>
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
