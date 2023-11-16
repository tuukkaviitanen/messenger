import { Box, Button, ListItem, TextField } from '@mui/material';
import { Message } from '../../utils/types';
import { useState } from 'react';
import { socket } from '../../utils/socket';


const initialMessages: Message[] = [{ message: 'hello', sender: 'tuukka' }, { message: 'how are you?', sender: 'tuukka' }];

const Chat = () => {

  const [messageField, setMessageField] = useState('');

  const [messages, setMessages] = useState(initialMessages)

  const sendMessage = () => {
    socket.emit('message', messageField)
    setMessageField('')
  }

  socket.on('message', (sender: string, message: string) => {
    setMessages([...messages, {sender, message}])
  })

  socket.on('connect_error', (error) => {
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
