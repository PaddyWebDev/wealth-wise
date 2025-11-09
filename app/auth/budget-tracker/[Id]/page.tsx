'use client';

import { useQuery } from '@tanstack/react-query';
import { BudgetOverview } from '@/components/budget-tracker/BudgetOverview';
import { AddIncomeForm } from '@/components/budget-tracker/AddIncomeForm';
import { AddExpenseForm } from '@/components/budget-tracker/AddExpenseForm';
import { SingleBudgetCharts } from '@/components/budget-tracker/SingleBudgetCharts';
import Loader from '@/components/Loader';
import { useParams, useRouter } from 'next/navigation';
import { getBudgetById } from '@/hooks/budget';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BudgetTracker() {
    const router = useRouter()
    const { Id } = useParams()
    if (!Id) {
        router.push("/auth/dashboard")
    }

    const { data: budget, isLoading: budgetLoading } = useQuery({
        queryKey: ['budget', Id],
        queryFn: async () => {
            const response = await getBudgetById(Id as string);
            return response;
        },
    });




    if (budgetLoading) {
        return <Loader />;
    }

    if (!budget) {
        return (
            <div className='w-full  h-[93dvh] flex items-center justify-center'>
                <div>
                    <h1 className='text-4xl font-bold'>
                        No Budget Found
                    </h1>
                    <Button onClick={() => router.push("/auth/dashboard")}>Back to Dashboard</Button>
                </div>
            </div>
        )
    }

    return (
        <section className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Budget for {budget.month}</h1>
                    <Button onClick={() => router.push("/auth/dashboard")} className="bg-neutral-800 hover:bg-neutral-700 text-white">Back to Dashboard</Button>
                </div>

                {/* Budget Overview */}
                <BudgetOverview budgets={[budget] as any} />

                {/* Charts */}
                <SingleBudgetCharts budget={budget as any} />

                {/* Investment Details */}
                <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                    <CardHeader>
                        <CardTitle className="text-neutral-900 dark:text-white">Investment Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Actual Savings: ${budget.actualSavings.toFixed(2)}
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Savings Goal: ${budget.savingsGoal.toFixed(2)}
                        </p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AddIncomeForm budgetId={Id as string} />
                    <AddExpenseForm budgetId={Id as string} />
                </div>

            </div>
        </section>
    );
}
