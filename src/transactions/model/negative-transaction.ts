import { TransactionTrail } from './transaction-trail';

export class NegativeTransaction extends TransactionTrail {
  setAmount(value: number): void {
    if (value > 0) {
      console.debug(
        'NegativeTransaction setValue(): A positive was given but will be saved as negative.',
        value,
      );
    }

    this.amount -= this.transformIntoAbsolute(value);
  }
}
