import express from 'express';
const app = express();

app.get('/api/healthz', (req, res) => {
	res.send('ok');
});

export default app;
