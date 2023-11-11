
import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
	console.log(`Express server listening on port ${port}`);
});
