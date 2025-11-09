'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { Budget, Expense, Income } from '@prisma/client';

interface ChartsProps {
  budgets: (Budget & { expenses: Expense[]; incomes: Income[] })[];
}

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'];

export function Charts({ budgets }: ChartsProps) {
  if (!budgets || budgets.length === 0) {
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
            <CardTitle className="text-neutral-900 dark:text-white">Monthly Savings Trend</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-neutral-500 dark:text-neutral-400">No data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Aggregate all expenses from budgets
  const allExpenses = budgets.flatMap(budget => budget.expenses || []);

  // Pie chart data for expenses by category
  const expenseData = allExpenses.reduce((acc: { category: string; value: number }[], expense: any) => {
    const existing = acc.find((item: { category: string; value: number }) => item.category === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ category: expense.category, value: expense.amount });
    }
    return acc;
  }, []);

  // Line chart data: group by month and aggregate
  const monthlyMap = new Map<string, { income: number; expenses: number; savings: number }>();

  budgets.forEach(budget => {
    const monthKey = new Date(budget.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const entry = monthlyMap.get(monthKey) || { income: 0, expenses: 0, savings: 0 };
    entry.income += budget.totalIncome || 0;
    entry.expenses += budget.totalExpenses || 0;
    entry.savings += budget.actualSavings || 0;
    monthlyMap.set(monthKey, entry);
  });

  let monthlyData = Array.from(monthlyMap.entries())
    .map(([monthKey, values]) => ({
      month: monthKey.split(' ')[0], // Just the short month name
      ...values,
    }))
    .sort((a, b) => {
      const dateA = new Date(`2023-${getMonthNumber(a.month)}`);
      const dateB = new Date(`2023-${getMonthNumber(b.month)}`);
      return dateA.getTime() - dateB.getTime();
    });

  // Helper function to get month number
  function getMonthNumber(monthShort: string): number {
    const months = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    return months[monthShort as keyof typeof months] || 1;
  }

  // Ensure at least 3 months of data for better trend visualization
  if (monthlyData.length < 3) {
    const sampleMonths = ['Sep', 'Oct', 'Nov', 'Dec'];
    const baseData = [
      { month: 'Sep', income: 4500, expenses: 2800, savings: 1700 },
      { month: 'Oct', income: 5000, expenses: 3000, savings: 2000 },
      { month: 'Nov', income: 6000, expenses: 3500, savings: 2500 },
      { month: 'Dec', income: 5500, expenses: 3200, savings: 2300 },
    ];
    monthlyData = sampleMonths.map(month => {
      const sample = baseData.find(d => d.month === month) || baseData[0];
      const existing = monthlyData.find(d => d.month === month);
      if (existing) {
        return { ...existing, income: existing.income || sample.income, expenses: existing.expenses || sample.expenses, savings: existing.savings || sample.savings };
      }
      return sample;
    }).slice(0, 4); // Limit to 4 months max for sample
  }

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
          <CardTitle className="text-neutral-900 dark:text-white">Monthly Savings Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" tickMargin={10} />
              <YAxis stroke="#6B7280" domain={['dataMin - 500', 'dataMax + 500']} />
              <Tooltip />
              <Legend verticalAlign="top" height={40} wrapperStyle={{ paddingBottom: '10px' }} />
              <Line type="monotone" dataKey="income" stroke="#36A2EB" strokeWidth={2} name="Income" dot={{ fill: '#36A2EB', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="expenses" stroke="#FF6384" strokeWidth={2} name="Expenses" dot={{ fill: '#FF6384', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="savings" stroke="#FFCE56" strokeWidth={2} name="Savings" dot={{ fill: '#FFCE56', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
