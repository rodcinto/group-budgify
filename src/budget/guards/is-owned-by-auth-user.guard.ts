import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BudgetService } from '../budget.service';

@Injectable()
export class IsOwnedByAuthUserGuard implements CanActivate {
  constructor(private readonly budgetService: BudgetService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = Number(request.user.user.user_id);
    const budgetId = Number(request.params.budgetId);

    const budget = await this.budgetService.findOne(budgetId, userId);

    return budget !== null;
  }
}
