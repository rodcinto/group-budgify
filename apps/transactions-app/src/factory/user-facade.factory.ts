import { Injectable } from '@nestjs/common';
import { BudgetFacade } from '../model/budget.facade';
import { UserFacade } from '../model/user.facade';
import { Owner } from '../model/owner';
import { Member } from '../model/member';

@Injectable()
export class UserFacadeFactory {
  buildUserFacade(userId: number, budgetFacade: BudgetFacade): UserFacade {
    if (userId === budgetFacade.getOwnerId()) {
      return new Owner(userId);
    }

    return new Member(userId);
  }
}
