import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BudgetService } from '../budget.service';

@Injectable()
export class IsAuthUserMemberGuard implements CanActivate {
  constructor(private readonly budgetService: BudgetService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = Number(request.user.user.user_id);
    const budgetId = Number(request.params.budgetId);

    const ownership = await this.budgetService.findOneOwned(budgetId, userId);

    const membership = await this.budgetService.findOneMembership(
      budgetId,
      userId,
    );

    return ownership !== null || membership !== null;
  }
}
