import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TransactionsEntity } from './entities/transactions.entity';
import { MerchantsEntity } from './entities/merchants.entity';
import { UsersEntity } from './entities/users.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    password: "postgres",
    host: "localhost",
    username: "postgres",
    port: 5434,
    namingStrategy: new SnakeNamingStrategy(),
    database: "postgres",
    autoLoadEntities: true,
    logging: false,
    logger: 'advanced-console',
  }), TypeOrmModule.forFeature([TransactionsEntity, MerchantsEntity, UsersEntity])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
