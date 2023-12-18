import { Injectable } from '@nestjs/common';
import { PositiveTransaction } from './model/positive-transaction';
import { DatabaseService } from '../database/database.service';
import { User } from './model/user';
import { Budget } from './model/budget';
import { Category } from './model/category';
import { NegativeTransaction } from './model/negative-transaction';

@Injectable()
export class TransactionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  add(
    budgetId: number,
    userId: number,
    amount: number,
    details?: string,
    categoryId?: number,
  ) {
    const transaction = new PositiveTransaction(
      this.databaseService,
      new User(userId),
      new Budget(budgetId),
      details,
      categoryId ? new Category(categoryId) : undefined,
    );
    transaction.setAmount(amount);
    return transaction.conclude();
  }

  subtract(
    budgetId: number,
    userId: number,
    amount: number,
    details?: string,
    categoryId?: number,
  ) {
    const transaction = new NegativeTransaction(
      this.databaseService,
      new User(userId),
      new Budget(budgetId),
      details,
      categoryId ? new Category(categoryId) : undefined,
    );
    transaction.setAmount(amount);
    return transaction.conclude();
  }
}
