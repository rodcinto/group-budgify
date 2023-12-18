import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { EncryptionHelper } from './crypt/encryption.helper';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { TransactionsService } from '../transactions/transactions.service';

@Module({
  controllers: [BudgetController, CategoriesController],
  providers: [
    BudgetService,
    EncryptionHelper,
    CategoriesService,
    TransactionsService,
  ],
})
export class BudgetModule {}
