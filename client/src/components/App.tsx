import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import { Container } from '@mui/material';
import Chat from './Chat';

const App = () => {
  return (
    <>
      <Container>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Chat />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
