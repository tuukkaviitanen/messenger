import {defineConfig} from 'cypress';
import * as dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.CYPRESS_BASE_URL;

if (!baseUrl) {
	console.error('Cypress baseUrl not set!');
	process.exit(1);
}

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			// Implement node event listeners here
		},
		baseUrl,
	},
});
