import express from 'express';
import 'express-async-errors';
import usersRouter from './controllers/users';
import {errorHandler} from './middleware';

const app = express();
app.use(express.json());

app.use('/api/users', usersRouter);

app.get('/api/healthz', (req, res) => res.send('ok'));

app.use(errorHandler);

export default app;
