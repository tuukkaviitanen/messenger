import { useEffect } from 'react';
import Chat from './Chat';
import NavBar from './NavBar';
import { useAppDispatch, useAppSelector } from '../../hooks/typedReduxHooks';
import { closeConnection, startConnection } from '../../reducers/socketSlice';

const MainPage = () => {
  const user = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();

  useEffect(() => {

    console.log(user)

    if (user) {
      dispatch(startConnection({ token: user.token }));
    }

    return () => {
      dispatch(closeConnection());
    };
  }, [user, dispatch]);

  return (
    <>
      <NavBar />

      <Chat />
    </>
  );
};

export default MainPage;
