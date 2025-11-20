'use client';

import { useQuery } from '@tanstack/react-query';
import { useSessionContext } from '@/context/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, TrendingUp, PiggyBank, Target } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

export default function FinancialProfile() {
    const { session } = useSessionContext();

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['financial-profile', session?.user?.id],
        queryFn: async () => {
            const response = await axios.get(`/api/financial-profile?userId=${session?.user?.id}`);
            return response.data
        },
        enabled: !!session?.user?.id,
    });

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Error loading financial profile: {error.message}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const getPersonalityColor = (type: string) => {
        switch (type) {
            case 'CONSERVATIVE': return 'bg-blue-100 text-blue-800';
            case 'BALANCED': return 'bg-green-100 text-green-800';
            case 'AGGRESSIVE': return 'bg-red-100 text-red-800';
            case 'SPENDER': return 'bg-yellow-100 text-yellow-800';
            case 'SAVER': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <section className="p-6 space-y-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Financial Personality Profile</h1>
            </div>

            {profile ? (
                <>
                    {/* Personality Type */}
                    <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                        <CardHeader>
                            <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Your Financial Personality
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge className={getPersonalityColor(profile.personalityType)}>
                                {profile.personalityType}
                            </Badge>
                            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                                {profile.advice}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Risk Tolerance */}
                    <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                        <CardHeader>
                            <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Risk Tolerance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Low Risk</span>
                                    <span className="text-neutral-600 dark:text-neutral-400">High Risk</span>
                                </div>
                                <Progress value={profile.riskTolerance * 100} className="w-full" />
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {(profile.riskTolerance * 100).toFixed(0)}% risk tolerance
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Savings Rate */}
                    <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                        <CardHeader>
                            <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
                                <PiggyBank className="h-5 w-5" />
                                Savings Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {profile.savingsRate.toFixed(2)}%
                            </p>
                            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                                Based on your historical budgets and savings.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Spending Habits */}
                    {profile.spendingHabits && Object.keys(profile.spendingHabits).length > 0 && (
                        <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                            <CardHeader>
                                <CardTitle className="text-neutral-900 dark:text-white">Spending Habits</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {Object.entries(profile.spendingHabits).map(([category, amount]) => (
                                        <div key={category} className="flex justify-between">
                                            <span className="text-neutral-600 dark:text-neutral-400">{category}</span>
                                            <span className="text-neutral-900 dark:text-white">₹{Number(amount).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            ) : (
                <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                            No financial profile available. Add some budgets and transactions to generate your profile.
                        </p>
                    </CardContent>
                </Card>
            )}
        </section>
    );
}
