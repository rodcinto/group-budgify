import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  private readonly selectMap = {
    id: true,
    email: true,
    first_name: true,
    last_name: true,
    password: false,
  };

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput): Promise<SafeUser> {
    return await this.databaseService.user.create({
      data: createUserDto,
      select: this.selectMap,
    });
  }

  async findAll(): Promise<SafeUser[]> {
    return this.databaseService.user.findMany({
      select: this.selectMap,
    });
  }

  async findOne(id: number): Promise<SafeUser | null> {
    const user = await this.databaseService.user.findUnique({
      where: {
        id,
      },
      select: this.selectMap,
    });

    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: {
        email,
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
      select: this.selectMap,
      data: updateUserDto,
    });
  }
}
