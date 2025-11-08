"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getBudgetById(budgetId: string) {
  return await prisma.budget.findUnique({
    where: {
      id: budgetId,
    },
    select: {
      id: true,
      userId: true,
      month: true,
      totalIncome: true,
      totalExpenses: true,
      savingsGoal: true,
      actualSavings: true,
      aiAdvice: true,
      expenses: true,
      incomes: true,
    },
  });
}

export async function getAllBudgets() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const budgets = await prisma.budget.findMany({
    where: { user: { email: session.user.email } },
    include: {
      incomes: true,
      expenses: true,
    },
    orderBy: { month: "asc" },
  });

  return budgets;
}
