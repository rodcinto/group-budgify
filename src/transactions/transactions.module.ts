import { Module } from '@nestjs/common';
import { Budget } from './model/budget';
import { Category } from './model/category';
import { PositiveTransaction } from './model/positive-transaction';
import { NegativeTransaction } from './model/negative-transaction';
import { User } from './model/user';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [User, Budget, Category, PositiveTransaction, NegativeTransaction],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
