import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { EncryptionHelper } from './crypt/encryption.helper';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { RmqModule } from 'common/rmq';

@Module({
  imports: [
    RmqModule.register({
      name: 'transaction',
    }),
  ],
  controllers: [BudgetController, CategoriesController],
  providers: [BudgetService, EncryptionHelper, CategoriesService],
  exports: [BudgetService],
})
export class BudgetModule {}
