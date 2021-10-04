import { PrimaryGeneratedColumn } from 'typeorm';

export class BaseStateEntity {
	@PrimaryGeneratedColumn()
	id: string;
}