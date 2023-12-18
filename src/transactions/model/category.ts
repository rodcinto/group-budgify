// This is just a facade of what could be a category. I am taking only what matters for Transactions.
export class Category {
  constructor(private readonly id: number) {}

  getId(): number {
    return this.id;
  }
}
