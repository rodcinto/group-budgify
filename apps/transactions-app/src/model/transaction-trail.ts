import { Prisma } from '@prisma/client';
import { DatabaseService } from 'common/database';
import { BudgetFacade } from './budget.facade';
import { Category } from './category';
import { Owner } from './owner';
import { Member } from './member';

type UserType = Member | Owner;
export abstract class TransactionTrail {
  protected amount: number = 0;
  protected moment: Date;

  constructor(
    private readonly databaseService: DatabaseService,
    protected user: UserType,
    protected budget: BudgetFacade,
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
