import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { EncryptionHelper } from './crypt/encryption.helper';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService, EncryptionHelper],
})
export class BudgetModule {}
