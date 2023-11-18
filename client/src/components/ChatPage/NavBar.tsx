import { Button, Typography } from '@mui/material';
import { removeCurrentUser } from '../../reducers/userSlicer';
import { useAppDispatch, useAppSelector } from '../../hooks/typedReduxHooks';

const NavBar = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    dispatch(removeCurrentUser());
  };

  return (
    <>
      <Typography>Logged in as {currentUser?.username}</Typography>
      <Button variant='contained' onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
};

export default NavBar;
