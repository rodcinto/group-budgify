import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
    return this.databaseService.user.create({ data: createUserDto });
  }

  async findAll(): Promise<User[]> {
    return this.databaseService.user.findMany({});
  }

  async findOne(id: number): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }
}
