import { TransactionTrail } from './transaction-trail';

export class NegativeTransaction extends TransactionTrail {
  setAmount(value: number): void {
    if (value > 0) {
      console.debug(
        'NegativeTransaction setValue(): A positive was given but will be saved as negative.',
        value,
      );
    }

    const absoluteValue = this.transformIntoAbsolute(value);
    const futureBudgetBalance = this.budget.getBalance() - absoluteValue;

    if (futureBudgetBalance < 0 && this.user.constructor.name !== 'Owner') {
      throw Error(
        'You can not take more money than you have, unless you own the Budget.',
      );
    }

    this.amount -= this.transformIntoAbsolute(value);
  }
}
