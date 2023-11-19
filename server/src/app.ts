import express from 'express';
import 'express-async-errors';
import usersRouter from './controllers/users';
import {errorHandler, parseToken} from './utils/middleware';
import loginRouter from './controllers/login';
import path from 'path';

const app = express();
app.use(express.json());

app.use(parseToken);

app.use(express.static(path.join(__dirname, '../../client/dist')))

app.use('/api/users', usersRouter);

app.use('/api/login', loginRouter);

app.get('/api/healthz', (req, res) => res.send('ok'));

app.use(errorHandler);

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
  res.sendFile(path.join(path.join(__dirname, '../../client/dist/index.html')));
});

export default app;
