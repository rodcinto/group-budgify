import { TransactionTrail } from './transaction-trail';

export class PositiveTransaction extends TransactionTrail {
  setAmount(value: number): void {
    if (value < 0) {
      console.debug(
        'PositiveTransaction setValue(): A negative was given but will be saved as positive.',
        value,
      );
    }

    this.amount += this.transformIntoAbsolute(value);
  }
}
