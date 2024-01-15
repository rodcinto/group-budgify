import { Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { EncryptionHelper } from './crypt/encryption.helper';
import { DatabaseService } from 'common/database';

@Injectable()
export class BudgetService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly encryptionHelper: EncryptionHelper,
  ) {}

  async create(userId: number, createBudgetDto: CreateBudgetDto) {
    const createdBudget = await this.databaseService.budget.create({
      data: {
        ...createBudgetDto,
        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return {
      ...createdBudget,
      invitation_key: await this.encryptionHelper.encrypt(
        createdBudget.id.toString(),
      ),
    };
  }

  findAll(owner_id: number) {
    return this.databaseService.budget.findMany({
      where: {
        owner_id,
      },
    });
  }

  findOneOwned(id: number, owner_id: number) {
    return this.databaseService.budget.findUnique({
      where: {
        id,
        owner_id,
      },
      include: {
        categories: true,
      },
    });
  }

  findOneById(id: number) {
    return this.databaseService.budget.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  findOneMembership(id: number, user_id: number) {
    return this.databaseService.budgetMembership.findUnique({
      where: {
        id,
        user_id,
      },
    });
  }

  update(id: number, owner_id: number, updateBudgetDto: UpdateBudgetDto) {
    return this.databaseService.budget.update({
      where: {
        id,
        owner_id,
      },
      data: updateBudgetDto,
    });
  }

  remove(id: number, owner_id: number) {
    return this.databaseService.budget.delete({
      where: {
        id,
        owner_id,
      },
    });
  }

  async generateInvitationKeyFor(
    id: number,
    owner_id: number,
  ): Promise<string> {
    const budget = await this.databaseService.budget.findUnique({
      where: {
        id,
        owner_id,
      },
      select: {
        id: true,
      },
    });

    if (budget === null) {
      return Promise.resolve('');
    }

    return this.encryptionHelper.encrypt(id.toString());
  }

  async joinBudget(budgetKey: string, userId: number): Promise<void> {
    const ERROR_MESSAGE = 'Could not join Budget';

    const budgetId = await this.encryptionHelper.decrypt(budgetKey);

    try {
      const budget = await this.databaseService.budget.findUniqueOrThrow({
        where: {
          id: Number(budgetId),
        },
      });

      if (budget.owner_id === userId) {
        return Promise.resolve();
      }
    } catch (error) {
      throw new Error(ERROR_MESSAGE);
    }

    const membership = await this.databaseService.budgetMembership.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        budget: {
          connect: {
            id: Number(budgetId),
          },
        },
      },
    });

    if (membership.id > 0) {
      return Promise.resolve();
    }

    throw new Error(ERROR_MESSAGE);
  }
}
