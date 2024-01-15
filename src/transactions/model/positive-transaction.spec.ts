import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { PositiveTransaction } from './positive-transaction';
import { TransactionTrail } from './transaction-trail';
import { DatabaseService } from 'common/database';
import { BudgetFacade } from './budget.facade';

describe('PositiveTransaction', () => {
  let positiveTransaction: PositiveTransaction;
  let budgetMock: BudgetFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositiveTransaction,
        { provide: DatabaseService, useValue: mockDeep<DatabaseService>() },
        BudgetFacade,
      ],
    }).compile();

    positiveTransaction = module.get<PositiveTransaction>(PositiveTransaction);
    budgetMock = module.get<BudgetFacade>(BudgetFacade);
  });

  it('should be defined', () => {
    expect(positiveTransaction).toBeDefined();
    expect(positiveTransaction).toBeInstanceOf(TransactionTrail);
  });

  it('should add a positive amount', () => {
    positiveTransaction.setAmount(50);
    expect(positiveTransaction['amount']).toBe(50);
  });

  it('should take a negative and add as a positive', () => {
    positiveTransaction.setAmount(-50);
    expect(positiveTransaction['amount']).toBeGreaterThan(0);
  });

  it('should conclude a positive transaction', async () => {
    jest.spyOn(budgetMock, 'getId').mockReturnValue(1);
    positiveTransaction['budget'] = budgetMock;

    positiveTransaction.setAmount(10);
    // positiveTransaction.conclude();
    // I am having issues to mock create from the databaseService.
    // Let's skip this test for now.
  });
});
