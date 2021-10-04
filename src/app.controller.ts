import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersEntity } from './entities/users.entity';
import { TransactionsEntity } from './entities/transactions.entity';
import { MerchantsEntity } from './entities/merchants.entity';

export interface IGetMerchantStatsByUserQuery {
  from: Date;
  to: Date;
  limit: number;
  offset: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/user/:userId/merchant-stats')
  async getMerchantStatsByUser(
    @Query() query: IGetMerchantStatsByUserQuery,
    @Param('userId') userId: string,
  ): Promise<any> {
    const { from, to, limit, offset } = query;
    return this.appService.getMerchantStatsByUser(userId, from, to, limit, offset);
  }

  @Post('/user')
  @HttpCode(201)
  async createUser(
    @Body() body: UsersEntity
  ) {
    await this.appService.createUser(body)
  }

  @Post('/merchant')
  @HttpCode(201)
  async createMerchant(
    @Body() body: MerchantsEntity
  ) {
    await this.appService.createMerchant(body)
  }

  @Post('/user/:userId/merchant/:merchantId/transaction')
  @HttpCode(201)
  async createTransaction(
    @Param('userId') userId: string,
    @Param('merchantId') merchantId: string,
    @Body() body: TransactionsEntity
  ) {
    await this.appService.createTransaction(
      body,
      userId,
      merchantId,
    )
  }
}
