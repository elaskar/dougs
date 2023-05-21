import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/infrastructure/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Post Movements Synchro Success', () => {
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send({
        movements: [
          {
            id: 1,
            date: '10/05/2023',
            amount: 100,
            wording: 'my first movement',
          },
        ],
        balances: [
          {
            date: '09/05/2023',
            balance: 0,
          },
          {
            date: '11/05/2023',
            balance: 100,
          },
        ],
      })
      .expect(200);
  });

  it('Post Movements Synchro Failure', () => {
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send({
        movements: [
          {
            id: 1,
            date: '10/05/2023',
            amount: 100,
            wording: 'my first movement',
          },
        ],
        balances: [
          {
            date: '09/05/2023',
            balance: 0,
          },
          {
            date: '11/05/2023',
            balance: 50,
          },
        ],
      })
      .expect(400);
  });

  it('Post Movements Synchro missing movements', () => {
    return request(app.getHttpServer())
        .post('/movements/validation')
        .send({

          balances: [
            {
              date: '09/05/2023',
              balance: 0,
            },
            {
              date: '11/05/2023',
              balance: 50,
            },
          ],
        })
        .expect(400);
  });

  it('Post Movements missing balances', () => {
    return request(app.getHttpServer())
        .post('/movements/validation')
        .send({
          movements: [
            {
              id: 1,
              date: '10/05/2023',
              amount: 100,
              wording: 'my first movement',
            },
          ],
          balances: [

          ],
        })
        .expect(400);
  });
});
