import {DataSource} from 'typeorm';
import config from './src/utils/config';

export default new DataSource({
	type: 'postgres',
	url: config.postgresUrl,
	synchronize: false,
	logging: true,
	entities: ['src/entities/**/*.ts'],
	subscribers: ['src/subscribers/**/*.ts'],
	migrations: ['src/migrations/**/*.ts'],
	migrationsTableName: 'migrations',
});
