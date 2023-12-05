import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { john } from '../src/users/personas';

describe('Use Cases', () => {
  // eslint-disable-next-line prettier/prettier
  const NEW_PASSWORD: string = "NeWPaSsWorD";

  let app: INestApplication;

  let johnsAccessToken: string;
  let johnsID: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('After creating his account, John reviews his profile and updates his password.', () => {
    it('John logs in', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: john.email,
          password: john.password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');

      johnsAccessToken = response.body.accessToken;
      johnsID = response.body.id;
    });

    it('John updates his password', async () => {
      await request(app.getHttpServer())
        .patch(`/users/${johnsID}`)
        .set('Authorization', `Bearer ${johnsAccessToken}`)
        .send({
          password: NEW_PASSWORD,
        })
        .expect(200);
    });

    it('John logs in with his new password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: john.email,
          password: NEW_PASSWORD,
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');

      johnsAccessToken = response.body.accessToken;
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
