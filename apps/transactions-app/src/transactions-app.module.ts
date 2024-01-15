import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../../../config/configuration';
import { BudgetFacade } from './model/budget.facade';
import { Category } from './model/category';
import { PositiveTransaction } from './model/positive-transaction';
import { NegativeTransaction } from './model/negative-transaction';
import { TransactionsAppService } from './transactions-app.service';
import { BudgetFacadeFactory } from './factory/budget-facade.factory';
import { UserFacadeFactory } from './factory/user-facade.factory';
import { TransactionsController } from './transactions-app.controller';
import { RmqModule } from 'common/rmq';
import { DatabaseModule } from 'common/database';

@Module({
  imports: [
    DatabaseModule,
    BudgetFacade,
    Category,
    PositiveTransaction,
    NegativeTransaction,
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
    RmqModule.register({
      name: 'transaction',
    }),
  ],
  providers: [TransactionsAppService, BudgetFacadeFactory, UserFacadeFactory],
  controllers: [TransactionsController],
})
export class TransactionsAppModule {}
