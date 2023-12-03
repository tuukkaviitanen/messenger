/* eslint-disable new-cap */
import {BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './User';

@Entity()
export class ChatMessage extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
		id!: string;

	@Column()
		content!: string;

	@Column()
		timestamp!: Date;

	@ManyToOne(() => User, {onUpdate: 'CASCADE', eager: true})
	@JoinColumn()
		sender!: User;

	@ManyToMany(() => User, {eager: true})
	@JoinTable()
		recipients!: User[];
}
