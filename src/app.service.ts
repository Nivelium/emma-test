import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Raw, Repository } from 'typeorm';
import { TransactionsEntity } from './entities/transactions.entity';
import { MerchantsEntity } from './entities/merchants.entity';
import { UsersEntity } from './entities/users.entity';
import { Kafka, Producer } from 'kafkajs';
import * as ip from 'ip';

@Injectable()
export class AppService implements OnModuleInit {
  @InjectRepository(UsersEntity)
  private readonly usersRepository: Repository<UsersEntity>

  @InjectRepository(MerchantsEntity)
  private readonly merchantsRepository: Repository<MerchantsEntity>

  @InjectRepository(TransactionsEntity)
  private readonly transactionsRepository: Repository<TransactionsEntity>

  private producer: Producer;

  async createUser(user) {
    /*await this.sendKafkaMessage('user', user);*/
    return this.usersRepository.save(user);
  }

  async createMerchant(merchant) {
    return this.merchantsRepository.save(merchant);
  }

  async createTransaction(transaction: TransactionsEntity, userId: string, merchantId: string) {
    const user = await this.usersRepository.findOne(userId);
    const merchant = await this.merchantsRepository.findOne(merchantId);

    return this.transactionsRepository.save({
      ...transaction,
      user,
      merchant,
    });
  }

  async getMerchantStatsByUser(
    userId: string,
    from: Date,
    to: Date,
    limit: number,
    offset: number
  ): Promise<any> {
    console.log('from', from);
    console.log('to', to);
    const merchants = await this.transactionsRepository.createQueryBuilder('transaction')
      .distinct()
      .select('transaction.merchant_id')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.date >= :from', { from })
      .andWhere('transaction.date < :to', { to })
      .limit(limit)
      .offset(offset)
      .getRawMany();

    const merchantIds = merchants.map((m) => m.merchant_id)

    const merchantsWithRanks = await this.transactionsRepository.query(`
      with totals as (
        select user_id, merchant_id, sum(amount) as total
        from "Transactions"
        where merchant_id = ANY($1)
          and date < $3::timestamp
          and date >= $4::timestamp
        group by 1, 2
      ), matrix as (
        select t.user_id, t.merchant_id, percent_rank() over (partition by t.merchant_id order by t.total) as rp
        from totals t
      )
      select me.*, m.rp
      from matrix m
             inner join "Merchants" me on m.merchant_id = me.id
      where m.user_id = $2;
    `, [merchantIds, userId, to, from]);

    return merchantsWithRanks.map(m => ({
      id: m.id,
      displayName: m.display_name,
      iconUrl: m.icon_url,
      funnyGifUrl: m.funny_gif_url,
      rp: m.rp,
    }));
  }

  async onModuleInit(): Promise<void> {
    const host = process.env.HOST_IP || ip.address();

    console.log('host', host);

    const kafka = new Kafka({
      brokers: [`${host}:9092`],
      clientId: 'tracker-app'
    });

    this.producer = kafka.producer({
      allowAutoTopicCreation: true,
      retry: {
        initialRetryTime: 100,
        retries: 8
      }
    });

    //await this.producer.connect();
  }
}
