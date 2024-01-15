import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { configuration } from '../../../config/configuration';
import { AuthModule } from './auth/auth.module';
import { BudgetModule } from './budget/budget.module';
import { RmqModule } from 'common/rmq';
import { DatabaseModule } from 'common/database';
@Module({
  imports: [
    AuthModule,
    UsersModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
    BudgetModule,
    RmqModule,
  ],
})
export class AppModule {}
