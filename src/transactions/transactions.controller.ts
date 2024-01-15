import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
import { BudgetFacadeFactory } from './factory/budget-facade.factory';
import { UserFacadeFactory } from './factory/user-facade.factory';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly budgetFacadeFactory: BudgetFacadeFactory,
    private readonly userFacadeFactory: UserFacadeFactory,
  ) {}

  @MessagePattern({ cmd: 'add-money' })
  addMoney(@Payload() data: any) {
    const budgetFacade = this.budgetFacadeFactory.buildBudgetFacade(
      data.budget,
    );
    const userFacade = this.userFacadeFactory.buildUserFacade(
      data.user_id,
      budgetFacade,
    );

    return this.transactionsService.add(
      budgetFacade,
      userFacade,
      data.amount,
      data.description,
      data.category_id,
    );
  }

  @MessagePattern({ cmd: 'take-money' })
  takeMoney(@Payload() data: any) {
    const budgetFacade = this.budgetFacadeFactory.buildBudgetFacade(
      data.budget,
    );
    const userFacade = this.userFacadeFactory.buildUserFacade(
      data.user_id,
      budgetFacade,
    );

    // It should be only possibe to take money if the balance is positive,
    // unless the user is the owner.
    // But I think I can break this logic in two parts.
    return this.transactionsService.subtract(
      budgetFacade,
      userFacade,
      data.amount,
      data.description,
      data.category_id,
    );
  }

  @MessagePattern({ cmd: 'balance-report' })
  balanceReport(@Payload() data: { budgetId: number }) {
    return this.transactionsService.createBalanceReport(Number(data.budgetId));
  }
}
