import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'common/database';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createOne(
    createCategoryDto: Prisma.BudgetCategoryUncheckedCreateInput,
  ) {
    return await this.databaseService.budgetCategory.create({
      data: {
        ...createCategoryDto,
      },
    });
  }
  async createMany(
    createCategoriesDto: Prisma.BudgetCategoryUncheckedCreateInput[],
  ) {
    return await this.databaseService.budgetCategory.createMany({
      data: createCategoriesDto,
    });
  }

  findAll(budget_id: number) {
    return this.databaseService.budgetCategory.findMany({
      where: {
        budget_id,
      },
    });
  }

  findOne(budget_id: number, id: number) {
    return this.databaseService.budgetCategory.findUnique({
      where: {
        id,
        budget_id,
      },
    });
  }

  update(
    paramBudgetId: number,
    id: number,
    updateCategoryDto: Prisma.BudgetCategoryUncheckedUpdateInput,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { budget_id, ...safeUpdateDto } = updateCategoryDto;

    return this.databaseService.budgetCategory.update({
      where: {
        id,
        budget_id: paramBudgetId,
      },
      data: safeUpdateDto,
    });
  }

  async delete(budget_id: number, id: number) {
    return this.databaseService.budgetCategory.delete({
      where: {
        id,
        budget_id,
      },
    });
  }
}
