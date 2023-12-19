import { Module } from '@nestjs/common';
import { BudgetFacade } from './model/budget.facade';
import { Category } from './model/category';
import { PositiveTransaction } from './model/positive-transaction';
import { NegativeTransaction } from './model/negative-transaction';
import { TransactionsService } from './transactions.service';
import { BudgetFacadeFactory } from './factory/budget-facade.factory';
import { UserFacadeFactory } from './factory/user-facade.factory';

@Module({
  imports: [BudgetFacade, Category, PositiveTransaction, NegativeTransaction],
  providers: [TransactionsService, BudgetFacadeFactory, UserFacadeFactory],
  exports: [TransactionsService, BudgetFacadeFactory, UserFacadeFactory],
})
export class TransactionsModule {}
