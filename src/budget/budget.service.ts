import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: number, createBudgetDto: CreateBudgetDto) {
    return await this.databaseService.budget.create({
      data: {
        ...createBudgetDto,
        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  findAll(owner_id: number) {
    return this.databaseService.budget.findMany({
      where: {
        owner_id,
      },
    });
  }

  findOne(id: number, owner_id: number) {
    return this.databaseService.budget.findUnique({
      where: {
        id,
        owner_id,
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
}
