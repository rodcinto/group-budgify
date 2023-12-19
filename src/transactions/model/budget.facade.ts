// This is just a facade of what could be the budget. I am taking only what matters for Transactions.
export class BudgetFacade {
  private balance: number = 0;

  constructor(
    private readonly id: number,
    private readonly ownerId: number,
  ) {}

  getId(): number {
    return this.id;
  }

  getOwnerId(): number {
    return this.ownerId;
  }

  getBalance(): number {
    return this.balance;
  }

  setBalance(amount: number): void {
    this.balance = amount;
  }
}
