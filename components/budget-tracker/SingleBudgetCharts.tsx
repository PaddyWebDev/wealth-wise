'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { Budget, Expense, Income } from '@prisma/client';

interface SingleBudgetChartsProps {
  budget: Budget & { expenses: Expense[]; incomes: Income[] };
}

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'];

export function SingleBudgetCharts({ budget }: SingleBudgetChartsProps) {
  if (!budget) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-neutral-500 dark:text-neutral-400">No data available</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-neutral-500 dark:text-neutral-400">No data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pie chart data for expenses by category
  const expenseData = (budget.expenses || []).reduce((acc: { category: string; value: number }[], expense: any) => {
    const existing = acc.find((item: { category: string; value: number }) => item.category === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ category: expense.category, value: expense.amount });
    }
    return acc;
  }, []);

  // Line chart data: income vs expenses (simplified for single budget)
  const monthlyData = [
    {
      month: new Date(budget.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      income: budget.totalIncome,
      expenses: budget.totalExpenses,
      savings: budget.actualSavings,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-white">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }: any) => {
                  return `${category} ${(percent * 100).toFixed(0)}%`
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-white">Budget Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#36A2EB" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#FF6384" strokeWidth={2} name="Expenses" />
              <Line type="monotone" dataKey="savings" stroke="#FFCE56" strokeWidth={2} name="Savings" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
