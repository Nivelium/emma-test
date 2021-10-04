import { BaseStateEntity } from './base-state.entity';
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToOne } from 'typeorm';
import { UsersEntity } from './users.entity';
import { MerchantsEntity } from './merchants.entity';

@Entity('Transactions')
export class TransactionsEntity extends BaseStateEntity {
	@Index()
	@Column()
	date: Date;

	@Column()
	amount: number;

	@Column()
	description: string;

	@Index()
	@ManyToOne(() => UsersEntity, user => user.transactions)
	user: UsersEntity

	@Index()
	@ManyToOne(() => MerchantsEntity, merch => merch.transactions)
	merchant: MerchantsEntity;
}
