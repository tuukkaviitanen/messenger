import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import { Container } from '@mui/material';
import Chat from './Chat';
import { useAppSelector, useStoredUser } from '../hooks';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  useStoredUser();

  const currentUser = useAppSelector((state) => state.user.currentUser);

  return (
    <>
      <Container>
        <Routes>
          <Route path='/login' element={currentUser ?  <Navigate to='/' replace /> : <Login />} />
          <Route
            path='/'
            element={currentUser ? <Chat /> : <Navigate to='/login' replace />}
          />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Container>
      <ToastContainer/>
    </>
  );
};

export default App;
