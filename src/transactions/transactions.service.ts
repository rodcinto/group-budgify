import { Injectable } from '@nestjs/common';
import { PositiveTransaction } from './model/positive-transaction';
import { DatabaseService } from '../database/database.service';
import { Category } from './model/category';
import { NegativeTransaction } from './model/negative-transaction';
import { BudgetFacadeFactory } from './factory/budget-facade.factory';
import { UserFacade } from './model/user.facade';
import { BudgetFacade } from './model/budget.facade';
import { TransactionTrail as TransactionTrailData } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly budgetFactory: BudgetFacadeFactory,
  ) {}

  async add(
    budget: BudgetFacade,
    user: UserFacade,
    amount: number,
    details?: string,
    categoryId?: number,
  ) {
    const balance = this.calculateFinalBalance(
      await this.retrieveBudgetTransactions(budget.getId()),
    );
    budget.setBalance(balance);

    const transaction = new PositiveTransaction(
      this.databaseService,
      user,
      budget,
      details,
      categoryId ? new Category(categoryId) : undefined,
    );

    transaction.setAmount(amount);
    return transaction.conclude();
  }

  async subtract(
    budget: BudgetFacade,
    user: UserFacade,
    amount: number,
    details?: string,
    categoryId?: number,
  ) {
    const balance = this.calculateFinalBalance(
      await this.retrieveBudgetTransactions(budget.getId()),
    );
    budget.setBalance(balance);

    const transaction = new NegativeTransaction(
      this.databaseService,
      user,
      budget,
      details,
      categoryId ? new Category(categoryId) : undefined,
    );
    transaction.setAmount(amount);
    return transaction.conclude();
  }

  calculateFinalBalance(budgetTransactions: TransactionTrailData[]) {
    if (!budgetTransactions || budgetTransactions.length === 0) {
      return 0;
    }

    return budgetTransactions.reduce(
      (currentBalance: number, transaction: TransactionTrailData) => {
        return currentBalance + Number(transaction.amount);
      },
      0,
    );
  }

  async retrieveBudgetTransactions(budgetId: number) {
    return await this.databaseService.transactionTrail.findMany({
      where: {
        budget_id: budgetId,
      },
    });
  }

  async createBalanceReport(budgetId: number) {
    const budgetTransactions = await this.retrieveBudgetTransactions(budgetId);
    const finalBalance = this.calculateFinalBalance(budgetTransactions);

    return { balance: finalBalance, transactions: { ...budgetTransactions } };
  }
}
