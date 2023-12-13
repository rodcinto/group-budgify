import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { john, paul, carla } from '../src/users/personas';
import { User } from '@prisma/client';

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
      john.password = NEW_PASSWORD;
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

  describe(`After having their accounts created, Paul checks Carla's profile.`, () => {
    let paulsAccessToken: string;

    it('Paul logs in', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: paul.email,
          password: paul.password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');

      paulsAccessToken = response.body.accessToken;
    });
    it(`Paul checks Carla's profile`, async () => {
      const response = await request(app.getHttpServer())
        .get('/users/3')
        .set('Authorization', `Bearer ${paulsAccessToken}`)
        .expect(200);

      expect(response.body.email).toEqual(carla.email);
    });
  });

  describe(`John creates a new Budget called Euro Tour and invite friends.`, () => {
    const currentDate: Date = new Date();
    const futureDate: Date = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 10);

    const currentDateISOString: string = currentDate.toISOString();
    const futureDateISOString: string = futureDate.toISOString();

    let johnsAccessToken: string;
    let paulsAccessToken: string;
    let carlasAccessToken: string;

    let invitationKey: string;

    const extractAuthData = (user: Omit<User, 'id'>) => ({
      username: user.email,
      password: user.password,
    });

    it('John logs in', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(extractAuthData(john))
        .expect(201);
      johnsAccessToken = response.body.accessToken;
    });
    it('Paul logs in', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(extractAuthData(paul))
        .expect(201);
      paulsAccessToken = response.body.accessToken;
    });
    it('Carla logs in', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(extractAuthData(carla))
        .expect(201);
      carlasAccessToken = response.body.accessToken;
    });

    it('John creates a new Budget', async () => {
      const response = await request(app.getHttpServer())
        .post('/budget')
        .set('Authorization', `Bearer ${johnsAccessToken}`)
        .send({
          title: 'Euro Tour',
          start_date: currentDateISOString,
          end_date: futureDateISOString,
          categories: {
            create: [
              {
                label: 'Transport',
                description: 'Our flight and train tickets.',
              },
              {
                label: 'Accommodations',
                description: 'Hotels and Hostels.',
              },
              {
                label: 'Foods and Drinks',
                description: 'Not for parties! Only when we are eating.',
              },
              {
                label: 'Leisure',
                description: 'Parties go here.',
              },
            ],
          },
        })
        .expect(201);

      invitationKey = response.body.invitation_key;

      expect(invitationKey.length).toBeGreaterThan(0);
    });

    it('Paul joins the budget.', async () => {
      await request(app.getHttpServer())
        .post('/budget/join')
        .set('Authorization', `Bearer ${paulsAccessToken}`)
        .send({
          key: invitationKey,
        })
        .expect(201);
    });
    it('Carla joins the budget.', async () => {
      await request(app.getHttpServer())
        .post('/budget/join')
        .set('Authorization', `Bearer ${carlasAccessToken}`)
        .send({
          key: invitationKey,
        })
        .expect(201);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
