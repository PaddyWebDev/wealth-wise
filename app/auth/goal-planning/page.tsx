'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Target, TrendingUp, Lightbulb } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { goalPlanningSchema, GoalPlanningFormData } from '@/lib/auth-form-schemas';
import { getSessionUser } from '@/hooks/user';

interface GoalPlanningResult {
    goalName: string;
    targetAmount: number;
    timeframeMonths: number;
    currentSavings: number;
    feasibility: {
        isFeasible: boolean;
        requiredMonthlyContribution: string;
        maxMonthlySavings: string;
        averageMonthlyIncome: string;
    };
    timeToGoal: {
        months: string;
        years: string;
    };
    strategies: Array<{
        type: string;
        suggestion: string;
        impact: string;
    }>;
}

export default function GoalPlanning() {
    const [result, setResult] = useState<GoalPlanningResult | null>(null);
    const [isPending, startTransition] = React.useTransition();

    const form = useForm<GoalPlanningFormData>({
        resolver: zodResolver(goalPlanningSchema),
        defaultValues: {
            goalName: '',
            targetAmount: '',
            timeframeMonths: '',
            currentSavings: '',
        },
    });

    const onSubmit = async (data: GoalPlanningFormData) => {
        startTransition(async () => {
            try {
                const session = await getSessionUser();
                const response = await axios.post(`/api/goal-planning?userId=${session?.user.id}`, data);
                setResult(response.data);
                toast.success('Goal planning completed successfully!');
                form.reset();
            } catch (error: any) {
                toast.error(error.response?.data?.error || 'An error occurred while planning your goal');
                console.error('Goal planning error:', error);
            }
        })

    };

    return (
        <section className="p-6 space-y-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Goal Planning</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Card */}
                <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                    <CardHeader>
                        <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Plan Your Financial Goal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="goalName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Goal Name</FormLabel>
                                            <FormControl>
                                                <Input disabled={isPending} placeholder="e.g., Emergency Fund, Vacation, Car Purchase" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="targetAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Amount (₹)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" disabled={isPending} placeholder="10000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="timeframeMonths"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Timeframe (Months)</FormLabel>
                                            <FormControl>
                                                <Input type="number" disabled={isPending} placeholder="12" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="currentSavings"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Savings (₹)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" disabled={isPending} placeholder="0" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={isPending} className="w-full">
                                    {isPending ? 'Planning...' : 'Plan My Goal'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Results Card */}
                {result && (
                    <div className="space-y-6">
                        {/* Feasibility */}
                        <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                            <CardHeader>
                                <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
                                    {result.feasibility.isFeasible ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                    Goal Feasibility
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Status:</span>
                                    <Badge variant={result.feasibility.isFeasible ? 'default' : 'destructive'}>
                                        {result.feasibility.isFeasible ? 'Achievable' : 'Not Achievable'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Required Monthly Contribution:</span>
                                    <span className="font-semibold">₹{result.feasibility.requiredMonthlyContribution}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Your Max Monthly Savings:</span>
                                    <span className="font-semibold">₹{result.feasibility.maxMonthlySavings}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Average Monthly Income:</span>
                                    <span className="font-semibold">₹{result.feasibility.averageMonthlyIncome}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Time to Goal */}
                        <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                            <CardHeader>
                                <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Time to Goal
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                        {result.timeToGoal.years} years ({result.timeToGoal.months} months)
                                    </p>
                                    <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                                        Based on your current savings rate
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Strategies */}
                        <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                            <CardHeader>
                                <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5" />
                                    Recommended Strategies
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {result.strategies.map((strategy, index) => (
                                    <Alert key={index}>
                                        <TrendingUp className="h-4 w-4" />
                                        <AlertDescription>
                                            <strong>{strategy.suggestion}</strong>
                                            <br />
                                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                                Impact: {strategy.impact}
                                            </span>
                                        </AlertDescription>
                                    </Alert>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </section>
    );
}
