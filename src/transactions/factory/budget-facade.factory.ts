import { Injectable } from '@nestjs/common';
import { BudgetFacade } from '../model/budget.facade';

@Injectable()
export class BudgetFacadeFactory {
  buildBudgetFacade(budgetData: any): BudgetFacade {
    const budget = new BudgetFacade(budgetData.id, budgetData.owner_id);

    return budget;
  }
}
