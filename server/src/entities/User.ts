/* eslint-disable new-cap */
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany} from 'typeorm';
import {ChatMessage} from './ChatMessage';

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
		id!: string;

	@Column({unique: true})
		username!: string;

	@Column()
		passwordHash!: string;

	@ManyToMany(() => ChatMessage, chatMessage => chatMessage.recipients)
		messages!: ChatMessage[];
}
