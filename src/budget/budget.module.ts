import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { EncryptionHelper } from './crypt/encryption.helper';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';

@Module({
  controllers: [BudgetController, CategoriesController],
  providers: [BudgetService, EncryptionHelper, CategoriesService],
})
export class BudgetModule {}
