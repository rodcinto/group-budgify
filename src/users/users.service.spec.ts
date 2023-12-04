import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  const johnSmith = {
    id: 1,
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@budgify.io',
  };
  const paulPeterson = {
    id: 2,
    first_name: 'Paul',
    last_name: 'Peterson',
    email: 'paul.peterson@budgify.io',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    usersService = module.get<UsersService>(UsersService);
    prismaMock = module.get(DatabaseService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  test('should create new user John Smith ', async () => {
    prismaMock.user.create.mockResolvedValue(johnSmith);
    await expect(usersService.create(johnSmith)).resolves.toEqual(johnSmith);
  });

  test('should update user John Smith last name', async () => {
    const updatedUser = {
      ...johnSmith,
      last_name: 'Smith Jr.',
    };

    prismaMock.user.update.mockResolvedValue(updatedUser);
    await expect(usersService.update(1, updatedUser)).resolves.toEqual(
      updatedUser,
    );
  });

  test('should find many users', async () => {
    prismaMock.user.findMany.mockResolvedValue([johnSmith, paulPeterson]);
    await expect(usersService.findAll()).resolves.toHaveLength(2);
  });

  test('should find one user called Paul with id 2', async () => {
    prismaMock.user.findUnique.mockResolvedValue(paulPeterson);
    await expect(usersService.findOne(2)).resolves.toEqual(paulPeterson);
  });
});
