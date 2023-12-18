-- CreateTable
CREATE TABLE "TransactionTrail" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(9,2) NOT NULL,
    "details" TEXT,
    "moment" TIMESTAMP(3) NOT NULL,
    "budget_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER,

    CONSTRAINT "TransactionTrail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionTrail" ADD CONSTRAINT "TransactionTrail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionTrail" ADD CONSTRAINT "TransactionTrail_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionTrail" ADD CONSTRAINT "TransactionTrail_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "BudgetCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
