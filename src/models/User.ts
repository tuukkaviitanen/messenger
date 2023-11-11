import {Model, DataTypes, type InferCreationAttributes, type InferAttributes, type CreationOptional} from 'sequelize';
import {type Sequelize} from 'sequelize/types/sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<string>;
	declare username: string;
	declare passwordHash: string;
}

const initUser = (sequelize: Sequelize) => {
	const user = User.init({
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		username: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		passwordHash: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize,
		underscored: true,
		timestamps: false,
		modelName: 'user',
	});

	return user;
};

export default initUser;
