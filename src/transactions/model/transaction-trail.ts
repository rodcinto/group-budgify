import { Prisma } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';
import { Budget } from './budget';
import { Category } from './category';
import { User } from './user';

export abstract class TransactionTrail {
  protected amount: number = 0;
  protected moment: Date;

  constructor(
    private readonly databaseService: DatabaseService,
    protected user: User,
    protected budget: Budget,
    protected details?: string,
    protected category?: Category,
    protected id?: number,
  ) {
    this.moment = new Date();
  }

  abstract setAmount(value: number): void;

  protected transformIntoAbsolute(value: number): number {
    return Math.abs(value);
  }

  async conclude() {
    const transactionTrailCreateDto: Prisma.TransactionTrailUncheckedCreateInput =
      {
        amount: this.amount,
        moment: this.moment,
        user_id: this.user.getId(),
        budget_id: this.budget.getId(),
        details: this.details ?? null,
        category_id:
          this.category !== undefined ? this.category.getId() : undefined,
      };

    return await this.databaseService.transactionTrail.create({
      data: transactionTrailCreateDto,
    });
  }
}
