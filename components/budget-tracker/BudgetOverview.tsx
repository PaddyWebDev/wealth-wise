'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Budget } from '@prisma/client';

interface BudgetOverviewProps {
  budgets: Budget[]
}

export function BudgetOverview({ budgets }: BudgetOverviewProps) {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-600 dark:text-neutral-400">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">$0</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-600 dark:text-neutral-400">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">$0</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-600 dark:text-neutral-400">Savings Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">$0</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-600 dark:text-neutral-400">Actual Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">$0</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Aggregate totals across all budgets
  const totalIncome = budgets.reduce((sum, b) => sum + b.totalIncome, 0);
  const totalExpenses = budgets.reduce((sum, b) => sum + b.totalExpenses, 0);
  const totalSavingsGoal = budgets.reduce((sum, b) => sum + b.savingsGoal, 0);
  const totalActualSavings = budgets.reduce((sum, b) => sum + b.actualSavings, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-neutral-600 dark:text-neutral-400">Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">${totalIncome.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-neutral-600 dark:text-neutral-400">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">${totalExpenses.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-neutral-600 dark:text-neutral-400">Savings Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">${totalSavingsGoal.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-neutral-600 dark:text-neutral-400">Actual Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">${totalActualSavings.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
