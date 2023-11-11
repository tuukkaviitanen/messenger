import express from 'express';
import usersRouter from './controllers/users';
const app = express();

app.use('/api/users', usersRouter);

app.get('/api/healthz', (req, res) => res.send('ok'));

export default app;
