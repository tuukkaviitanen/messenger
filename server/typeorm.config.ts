import {DataSource} from 'typeorm';
import config from './src/utils/config';
import path from 'node:path';
import {DatabaseLogger} from './src/utils/logger';

export default new DataSource({
	type: 'postgres',
	url: config.postgresUrl,
	synchronize: false,
	logging: true,
	logger: new DatabaseLogger(),
	// Path creation needs to take into account running with typeorm.config.ts AND .js, which are located in different directories.
	// __dirname means translates into the directory in which typeorm.config is located, as ./ would always translate into project root.
	entities: [path.join(__dirname, 'src/entities/**/*.{js,ts}')],
	subscribers: [path.join(__dirname, 'src/subscribers/**/*.{js,ts}')],
	migrations: [path.join(__dirname, 'src/migrations/**/*.{js,ts}')],
	migrationsTableName: 'migrations',
});
