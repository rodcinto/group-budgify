import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { EncryptionHelper } from './crypt/encryption.helper';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { TransactionsService } from '../transactions/transactions.service';
import { BudgetFacadeFactory } from '../transactions/factory/budget-facade.factory';
import { UserFacadeFactory } from '../transactions/factory/user-facade.factory';
import { RmqModule } from 'common/rmq';

@Module({
  imports: [
    RmqModule.register({
      name: 'transaction',
    }),
  ],
  controllers: [BudgetController, CategoriesController],
  providers: [
    BudgetService,
    EncryptionHelper,
    CategoriesService,
    TransactionsService,
    BudgetFacadeFactory,
    UserFacadeFactory,
  ],
  exports: [BudgetService],
})
export class BudgetModule {}
