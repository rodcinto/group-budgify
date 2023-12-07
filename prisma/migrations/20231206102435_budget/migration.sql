-- CreateTable
CREATE TABLE "Budget" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetMembership" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "budget_id" INTEGER NOT NULL,

    CONSTRAINT "BudgetMembership_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetMembership" ADD CONSTRAINT "BudgetMembership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetMembership" ADD CONSTRAINT "BudgetMembership_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
