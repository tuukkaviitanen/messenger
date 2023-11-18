import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import { Container } from '@mui/material';
import ChatPage from './ChatPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../hooks/typedReduxHooks';
import { useStoredUser } from '../hooks/useStoredUser';

const App = () => {
  useStoredUser();

  const currentUser = useAppSelector((state) => state.user.currentUser);

  return (
    <>
      <Container>
        <Routes>
          <Route path='/login' element={currentUser ?  <Navigate to='/' replace /> : <LoginPage />} />
          <Route
            path='/*'
            element={currentUser ? <ChatPage /> : <Navigate to='/login' replace />}
          />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Container>
      <ToastContainer/>
    </>
  );
};

export default App;
