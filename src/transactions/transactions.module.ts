import { Module } from '@nestjs/common';
import { BudgetFacade } from './model/budget.facade';
import { Category } from './model/category';
import { PositiveTransaction } from './model/positive-transaction';
import { NegativeTransaction } from './model/negative-transaction';
import { TransactionsService } from './transactions.service';
import { BudgetFacadeFactory } from './factory/budget-facade.factory';
import { UserFacadeFactory } from './factory/user-facade.factory';
import { TransactionsController } from './transactions.controller';
import { RmqModule } from 'common/rmq';

@Module({
  imports: [
    BudgetFacade,
    Category,
    PositiveTransaction,
    NegativeTransaction,
    RmqModule.register({
      name: 'transaction',
    }),
  ],
  providers: [TransactionsService, BudgetFacadeFactory, UserFacadeFactory],
  exports: [TransactionsService, BudgetFacadeFactory, UserFacadeFactory],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
