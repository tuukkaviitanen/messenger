import { SxProps } from '@mui/material';

export type StyleSheet = Record<string, SxProps>;

export interface UserCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
}

export interface ExpectedAxiosErrorResponse {
  error: string
}

export interface Message {
  sender: string,
  message: string,
  timestamp: Date
}