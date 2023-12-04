import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
import { john, paul, carla } from '../src/users/personas';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const fakeUsersService = {
    findAll: () => [
      { id: 1, ...john },
      { id: 2, ...paul },
      { id: 3, ...carla },
    ],
    findOne: () => [{ id: 1, ...john }],
    create: () => [{ id: 3, ...carla }],
    update: () => [{ id: 3, ...carla, last_name: 'Tillmann' }],
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(fakeUsersService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(fakeUsersService.findAll());
  });

  it('/users/1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(200)
      .expect(fakeUsersService.findOne());
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .expect(201)
      .expect(fakeUsersService.create());
  });

  it('/users/3 (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/users/3')
      .expect(200)
      .expect(fakeUsersService.update());
  });

  afterAll(async () => {
    await app.close();
  });
});
