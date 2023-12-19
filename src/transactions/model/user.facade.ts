// This is just a facade of what could be the user. I am taking only what matters for Transactions.
export abstract class UserFacade {
  constructor(private readonly id: number) {}

  getId(): number {
    return this.id;
  }
}
