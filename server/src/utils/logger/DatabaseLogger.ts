import {type Logger as BaseLogger, type QueryRunner} from 'typeorm';
import logger from '.';
export default class DatabaseLogger implements BaseLogger {
	logQuery(query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
		logger.log('Query', {query, parameters});
	}

	logQueryError(error: string | Error, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
		const errorMessage = (error instanceof Error) ? error.message : error;
		logger.info('Database error', {error: errorMessage, query, parameters});
	}

	logQuerySlow(time: number, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
		logger.log('Query slow', {time, query, parameters});
	}

	logSchemaBuild(message: string, queryRunner?: QueryRunner | undefined) {
		logger.log(message);
	}

	logMigration(message: string, queryRunner?: QueryRunner | undefined) {
		logger.log(message);
	}

	log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner | undefined) {
		switch (level) {
			case 'log':
				logger.log(message);
				break;
			case 'info':
				logger.info(message);
				break;
			case 'warn':
				logger.warn(message);
				break;
			default:
				logger.error(`invalid logger level: ${level as string}`, message);
		}
	}
}
