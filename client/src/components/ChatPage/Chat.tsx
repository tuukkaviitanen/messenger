import {
  Box,
  Button,
  ListItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Message, StyleSheet } from '../../utils/types';
import { useState, useCallback } from 'react';
import { useAppSelector } from '../../hooks/typedReduxHooks';

const styles: StyleSheet = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    m: 1,
    p: 1,
  },
  textField: {
    flexGrow: 1,
  },
  chatArea: {
    flexGrow: 1,
    overflow: 'auto',
    height: 100, // This can be anything except 1, it will grow because of flexGrow
  },
};

const Chat = () => {
  const [messageField, setMessageField] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);

  const socket = useAppSelector((state) => state.socket.connection);

  const setRef = useCallback((node: HTMLElement | null) => {
    if(node){
      node.scrollIntoView({behavior: 'smooth'})
    }
  }, [])

  const sendMessage = () => {
    socket?.emit('message', messageField);
    setMessageField('');
  };

  socket?.on('message', (sender: string, message: string) => {
    setMessages([...messages, { sender, message }]);
  });

  socket?.on('connect_error', (error) => {
    setMessages([...messages, { sender: 'server', message: error.message }]);
  });

  return (
    <Box sx={styles.container}>
      <Box sx={styles.chatArea}>
        {messages.map((m, index) => {
          const lastMessage = messages.length - 1 === index
          return (
            <ListItem
              ref={lastMessage ? setRef : null}
              key={m.sender + m.message}
            >
              <Typography>
                {m.sender}: {m.message}
              </Typography>
            </ListItem>
          );
        })}
      </Box>
      <Paper elevation={10} sx={styles.inputContainer}>
        <TextField
          sx={styles.textField}
          value={messageField}
          onChange={(event) => {
            setMessageField(event.target.value);
          }}
        />
        <Button variant='contained' onClick={sendMessage}>
          Send
        </Button>
      </Paper>
    </Box>
  );
};

export default Chat;
