import { Box, Button, ListItem, TextField } from '@mui/material';
import { Message } from '../../utils/types';
import { useState } from 'react';
import { useAppSelector } from '../../hooks/typedReduxHooks';

const Chat = () => {

  const [messageField, setMessageField] = useState('');

  const [messages, setMessages] = useState<Message[]>([])

  const socket = useAppSelector(state => state.socket.connection)

  const sendMessage = () => {
    socket?.emit('message', messageField)
    setMessageField('')
  }

  socket?.on('message', (sender: string, message: string) => {
    setMessages([...messages, {sender, message}])
  })

  socket?.on('connect_error', (error) => {
    setMessages([...messages, {sender: 'server', message: error.message}])
  })


  return (
    <>
      <Box>
        {messages.map((m) => (
          <ListItem key={m.sender + m.message}>
            {m.sender}: {m.message}
          </ListItem>
        ))}
      </Box>
      <TextField value={messageField} onChange={(event) => { setMessageField(event.target.value); }}/>
      <Button onClick={sendMessage}>Send</Button>
    </>
  );
};

export default Chat;
