import {
  Box,
  ListItem,
  Typography,
} from '@mui/material';
import { Message, StyleSheet } from '../../utils/types';
import { useState, useCallback, useEffect } from 'react';
import { useAppSelector } from '../../hooks/typedReduxHooks';
import ChatInput, {  OnSubmit } from './ChatInput';

const styles: StyleSheet = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 10,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    m: 1,
    p: 1,
  },
  chatArea: {
    flexGrow: 1,
    overflow: 'auto',
    height: 100, // This can be anything except 1, it will grow because of flexGrow
  },
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const socket = useAppSelector((state) => state.socket.connection);

  const setRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      node.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

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

  const handleSendMessage: OnSubmit = ({messageField}, {resetForm}) => {
    socket?.emit(SocketEvent.Message, messageField);
    resetForm();
  }

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
      <ChatInput handleSendMessage={handleSendMessage} />
    </Box>
  );
};

export default Chat;
