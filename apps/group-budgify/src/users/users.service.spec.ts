import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UsersService } from './users.service';
import { DatabaseService } from 'common/database';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { john, paul } from './personas';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  const decoratedJohn = {
    id: 1,
    ...john,
  };
  const decoratedPaul = {
    id: 2,
    ...paul,
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
    prismaMock.user.create.mockResolvedValue(decoratedJohn);
    expect(decoratedJohn).toMatchObject(await usersService.create(john));
  });

  test('should update user John Smith last name', async () => {
    const updatedUser = {
      ...decoratedJohn,
      last_name: 'Smith Jr.',
    };

    prismaMock.user.update.mockResolvedValue(updatedUser);
    await expect(usersService.update(1, updatedUser)).resolves.toEqual(
      updatedUser,
    );
  });

  test('should find many users', async () => {
    prismaMock.user.findMany.mockResolvedValue([decoratedJohn, decoratedPaul]);
    await expect(usersService.findAll()).resolves.toHaveLength(2);
  });

  test('should find one user called Paul with id 2', async () => {
    prismaMock.user.findUnique.mockResolvedValue(decoratedPaul);
    await expect(usersService.findOne(2)).resolves.toEqual(decoratedPaul);
  });
});
