import config from './config';

/* eslint-disable no-console */
const info = (...params: any[]) => {
	if (config.nodeEnv === 'test') {
		return;
	}

	console.info(params);
};

const error = (...params: any[]) => {
	console.error(params);
};

const logger = {info, error};

export default logger;
