/* eslint-disable @typescript-eslint/naming-convention */
// Migrations/00_initial.js
import {type QueryInterface, DataTypes} from 'sequelize';

type Params = {
	context: QueryInterface;
};

async function up({context: queryInterface}: Params) {
	await queryInterface.createTable('users', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		username: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true,
		},
		password_hash: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	});
}

async function down({context: queryInterface}: Params) {
	await queryInterface.dropTable('users');
}

module.exports = {up, down};
