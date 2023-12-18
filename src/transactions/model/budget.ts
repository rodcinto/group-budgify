// This is just a facade of what could be the budget. I am taking only what matters for Transactions.
export class Budget {
  constructor(private readonly id: number) {}

  getId(): number {
    return this.id;
  }
}
