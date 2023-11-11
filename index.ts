import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

app.get('/api/healthz', (req, res) => {
	res.send('ok');
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
	console.log(`Express server listening on port ${port}`);
});
