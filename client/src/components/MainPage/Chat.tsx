import { Box, Button, ListItem, TextField } from '@mui/material';
import { Message } from '../../utils/types';
import { useState } from 'react';

interface Params {
  messages: Message[];
}

const Chat = ({ messages }: Params) => {

  const [messageField, setMessageField] = useState('');

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
      <Button>Send</Button>
    </>
  );
};

export default Chat;
