-- CreateTable
CREATE TABLE "BudgetCategory" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "budget_id" INTEGER NOT NULL,

    CONSTRAINT "BudgetCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BudgetCategory_label_budget_id_key" ON "BudgetCategory"("label", "budget_id");

-- AddForeignKey
ALTER TABLE "BudgetCategory" ADD CONSTRAINT "BudgetCategory_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
