/*
  Warnings:

  - A unique constraint covering the columns `[user_id,budget_id]` on the table `BudgetMembership` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BudgetMembership_user_id_budget_id_key" ON "BudgetMembership"("user_id", "budget_id");
