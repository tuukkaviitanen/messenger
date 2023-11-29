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

const warn = (...params: any[]) => {
	console.warn(params);
};

const debug = (...params: any[]) => {
	console.debug(params);
};

const logger = {log, info, error, warn, debug};

export default logger;
