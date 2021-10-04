import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { createConnection } from 'typeorm';
import { UsersEntity } from '../dist/entities/users.entity';
import { Connection } from 'typeorm/connection/Connection';
import ormconfig = require('../ormconfig.js');
import { MerchantsEntity } from '../src/entities/merchants.entity';
import { TransactionsEntity } from '../src/entities/transactions.entity';
import { sub } from 'date-fns';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    //@ts-ignore
    connection = await createConnection({
      name: 'migration',
      ...ormconfig,
    });
    try {
      await connection.runMigrations({
        transaction: 'none'
      })
      console.log('rly');
    } catch (e) {

    }

    await app.init();

    for (let i = 0; i < 1; i++) {
      console.time(i.toString());
      const user: Partial<UsersEntity> = {
        firstName: 'asd',
        lastName: 'asd',
      }
      const fixtures = Array.from({ length: 5 });
      const promises = fixtures.map(async () => request(app.getHttpServer())
        .post('/user')
        .send(user));
      try {
        await Promise.all(promises);
      } catch (e) {
        console.log(e);
        throw e;
      }
      console.timeEnd(i.toString());
    }

    for (let i = 0; i < 2; i++) {
      console.time(i.toString());
      const merchant: Partial<MerchantsEntity> = {
        displayName: 'asdasdads',
        iconUrl: 'asdasdasdasd',
        funnyGifUrl: 'aaaaaaaa',
      }
      const fixtures = Array.from({ length: 5 });
      const promises = fixtures.map(async () => request(app.getHttpServer())
        .post('/merchant')
        .send(merchant));
      try {
        await Promise.all(promises);
      } catch (e) {
        console.log(e);
        throw e;
      }
      console.timeEnd(i.toString());
    }

    const now = new Date();

    for (let i = 0; i < 5; i++) {
      console.time(i.toString());
      const transaction: (index: number) => Partial<TransactionsEntity> = (index) => {
        return {
          description: 'asdsad',
          amount: Math.floor(Math.random() * 1000),
          date: sub(now, {
            hours: i,
            minutes: index,
          }),
        }
      }
      const fixtures = Array.from({ length: 200 });
      const promises = fixtures.map(async (k, index) => {
        const userId = Math.floor(Math.random() * 5) + 1;
        const merchantId = Math.floor(Math.random() * 10) + 1;
        return request(app.getHttpServer())
          .post(`/user/${userId}/merchant/${merchantId}/transaction`)
          .send(transaction(index))
      });
      try {
        await Promise.all(promises);
      } catch (e) {
        console.log(e);
        throw e;
      }
      console.timeEnd(i.toString());
    }
  }, 15 * 10e3);

  it('/ (GET)', async () => {
    const now = new Date();
    const userId = Math.floor(Math.random() * 5) + 1;
    const from = sub(now, { days: 3 }).toUTCString();
    const to = sub(now, { days: 2 }).toUTCString();

    const result = request(app.getHttpServer())
      .get(`/user/${userId}/merchant-stats?from=${from}&to=${to}&limit=25&offset=50`);

    return result
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
    await connection.close();
  })
});
