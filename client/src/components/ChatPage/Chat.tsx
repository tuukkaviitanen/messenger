import {
  Box,
  Button,
  ListItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Message, StyleSheet } from '../../utils/types';
import { useState, useCallback, useEffect } from 'react';
import { useAppSelector } from '../../hooks/typedReduxHooks';

const styles: StyleSheet = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 10
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
    if (node) {
      node.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const sendMessage = () => {
    socket?.emit('message', messageField);
    setMessageField('');
  };

  enum SocketEvent {
    Message = 'message',
    ConnectionError = 'connect_error',
  }

  interface MessageContent {
    sender: string;
    message: string;
    timestamp: string;
  }

  useEffect(() => {
    if (!socket) return;

    socket.on(
      SocketEvent.Message,
      ({ sender, message, timestamp }: MessageContent) => {
        setMessages([
          ...messages,
          { sender, message, timestamp: new Date(timestamp) },
        ]);
      }
    );

    socket.on(SocketEvent.ConnectionError, (error) => {
      setMessages([
        ...messages,
        { sender: 'server', message: error.message, timestamp: new Date() },
      ]);
    });

    return () => {
      socket.off(SocketEvent.Message);
      socket.off(SocketEvent.ConnectionError);
    };
  }, [socket, SocketEvent, messages]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.chatArea}>
        {messages.map((m, index) => {
          const lastMessage = messages.length - 1 === index;
          return (
            <ListItem
              ref={lastMessage ? setRef : null}
              key={m.sender + m.message + m.timestamp.toISOString()}
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
