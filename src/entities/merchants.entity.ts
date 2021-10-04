import { BaseStateEntity } from './base-state.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { TransactionsEntity } from './transactions.entity';

@Entity('Merchants')
export class MerchantsEntity extends BaseStateEntity {
	@Column()
	displayName: string;

	@Column()
	iconUrl: string;

	@Column()
	funnyGifUrl: string;

	@OneToMany(() => TransactionsEntity, tx => tx.merchant)
	transactions: TransactionsEntity[];
}