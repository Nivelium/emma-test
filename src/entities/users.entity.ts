import { Column, Entity, OneToMany } from 'typeorm';
import { BaseStateEntity } from './base-state.entity';
import { TransactionsEntity } from './transactions.entity';

@Entity('Users')
export class UsersEntity extends BaseStateEntity {
	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@OneToMany(() => TransactionsEntity, tx => tx.user)
	transactions: TransactionsEntity[];
}
