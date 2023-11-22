import config from './config';

/* eslint-disable no-console */
const info = (...params: any[]) => {
	console.info(params);
};

const log = (...params: any[]) => {
	if (config.nodeEnv === 'test') {
		return;
	}

	console.log(params);
};

const error = (...params: any[]) => {
	console.error(params);
};

const logger = {log, info, error};

export default logger;
