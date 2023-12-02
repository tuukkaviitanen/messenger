import {type Logger as BaseLogger, type QueryRunner} from 'typeorm';
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

export class DatabaseLogger implements BaseLogger {
	logQuery(query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
		log('Query', {query, parameters});
	}

	logQueryError(error: string | Error, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
		const errorMessage = (error instanceof Error) ? error.message : error;
		warn('Database error', {error: errorMessage, query, parameters});
	}

	logQuerySlow(time: number, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
		log('Query slow', {time, query, parameters});
	}

	logSchemaBuild(message: string, queryRunner?: QueryRunner | undefined) {
		log(message);
	}

	logMigration(message: string, queryRunner?: QueryRunner | undefined) {
		log(message);
	}

	log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner | undefined) {
		switch (level) {
			case 'log':
				log(message);
				break;
			case 'info':
				info(message);
				break;
			case 'warn':
				warn(message);
				break;
			default:
				throw new Error('log level invalid');
		}
	}
}
