"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { getSessionUser } from "./user";

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
  const session = await getSessionUser();

  if(!session?.user){
    throw new Error("Unauthorized User")
  }

  const budgets = await prisma.budget.findMany({
    where: { userId: session?.user.id },
    include: {
      incomes: true,
      expenses: true,
    },
    orderBy: { month: "asc" },
  });

  return budgets;
}
