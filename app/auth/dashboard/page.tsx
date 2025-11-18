'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllBudgets } from '@/hooks/budget';
import { BudgetOverview } from '@/components/budget-tracker/BudgetOverview';
import { Charts } from '@/components/budget-tracker/Charts';
import { AddBudgetForm } from '@/components/budget-tracker/AddBudgetForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { data: budgets, isLoading, error } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => await getAllBudgets(),
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">Error loading budgets: {error.message}</p>
      </div>
    );
  }

  const totalSavings = budgets?.reduce((sum, b) => sum + b.actualSavings, 0) || 0;

  return (
    <section className="p-6 space-y-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>

      </div>

      {/* Investment Details */}
      <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-white">Savings Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
            Total Savings: ₹{totalSavings.toFixed(2)}
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Based on your actual savings across all budgets.
          </p>
        </CardContent>
      </Card>

      {/* Budget Overview */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">Budget Overview</h2>
        <BudgetOverview budgets={budgets || []} />
      </section>

      {/* Visualizations */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">Visualizations</h2>
        <Charts budgets={budgets || []} />
      </section>

      {/* All Budgets List */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">All Budgets</h2>
        {budgets && budgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <Card key={budget.id} className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <CardHeader>
                  <CardTitle className="text-neutral-900 dark:text-white">{budget.month}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 dark:text-neutral-400">Income: ₹{budget.totalIncome.toFixed(2)}</p>
                  <p className="text-neutral-600 dark:text-neutral-400">Expenses: ₹{budget.totalExpenses.toFixed(2)}</p>
                  <p className="text-neutral-600 dark:text-neutral-400">Savings Goal: ₹{budget.savingsGoal.toFixed(2)}</p>
                  <p className="text-neutral-600 dark:text-neutral-400">Actual Savings: ₹{budget.actualSavings.toFixed(2)}</p>
                  <Button asChild className='mt-3'>
                    <Link href={`/auth/budget-tracker/${budget.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            {budgets && budgets.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">Add New Budget</h2>
                <AddBudgetForm />
              </section>
            )}
          </div>
        ) : (
          <div>
            <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">No budgets found. Create your first budget to get started.</p>
                <AddBudgetForm />
              </CardContent>
            </Card>

            {budgets && budgets.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">Add New Budget</h2>
                <AddBudgetForm />
              </section>
            )}
          </div>
        )}


      </section>


    </section>
  );
}
