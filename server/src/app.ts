import express from 'express';
import 'express-async-errors';
import usersRouter from './controllers/users';
import {errorHandler, parseToken} from './middleware';
import loginRouter from './controllers/login';

const app = express();
app.use(express.json());

app.use(parseToken);

app.use('/api/users', usersRouter);

app.use('/api/login', loginRouter);

app.get('/api/healthz', (req, res) => res.send('ok'));

app.use(errorHandler);

export default app;
