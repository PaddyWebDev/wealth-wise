"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSessionContext } from '@/context/session'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, Target, TrendingUp, Calendar } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import queryClient from '@/lib/tanstack-query'
import { Goal } from '@prisma/client'
import { useRouter } from 'next/navigation'


export default function GoalsPage() {
    const router = useRouter();
    const { session } = useSessionContext()

    const { data: goals, isLoading } = useQuery({
        queryKey: ['goals', session?.user?.id],
        queryFn: async () => {
            const response = await axios.get(`/api/goals?userId=${session?.user.id}`)
            return response.data as Goal[]
        },
        enabled: !!session?.user?.id,
    })

    const updateGoalMutation = useMutation({
        mutationFn: async ({ goalId, status }: { goalId: string; status: string }) => {
            const response = await axios.patch(`/api/goals?userId=${session?.user.id}`, { goalId, status })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] })
            toast.success('Goal status updated successfully!')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update goal status')
        },
    })

    const handleStatusUpdate = (goalId: string, status: string) => {
        updateGoalMutation.mutate({ goalId, status })
    }

    if (!session?.user) {
        return <div className="flex items-center justify-center min-h-screen">No user session found.</div>
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACHIEVED':
                return <CheckCircle className="h-5 w-5 text-green-500" />
            case 'ABANDONED':
                return <XCircle className="h-5 w-5 text-red-500" />
            default:
                return <Clock className="h-5 w-5 text-blue-500" />
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'ACHIEVED':
                return 'default'
            case 'ABANDONED':
                return 'destructive'
            default:
                return 'secondary'
        }
    }

    const getProgressPercentage = (current: number, target: number) => {
        return Math.min((current / target) * 100, 100)
    }

    const activeGoals = goals?.filter(goal => goal.status === 'ACTIVE') || []
    const achievedGoals = goals?.filter(goal => goal.status === 'ACHIEVED') || []
    const abandonedGoals = goals?.filter(goal => goal.status === 'ABANDONED') || []

    return (
        <div className="container mx-auto p-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">My Goals</h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Track your financial goals and celebrate your achievements
                        </p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/auth/goal-planning")}>
                        <Target className="h-4 w-4 mr-2" />
                        Create New Goal
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Active Goals</p>
                                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">{activeGoals.length}</p>
                                </div>
                                <Clock className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Achieved Goals</p>
                                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">{achievedGoals.length}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Goals</p>
                                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">{goals?.length || 0}</p>
                                </div>
                                <Target className="h-8 w-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Goals Sections */}
                <div className="space-y-8">
                    {/* Active Goals */}
                    {activeGoals.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-500" />
                                Active Goals
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {activeGoals.map((goal) => (
                                    <Card key={goal.id} className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-lg text-neutral-900 dark:text-white">{goal.title}</CardTitle>
                                                    <Badge variant="secondary" className="w-fit">
                                                        {goal.category.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <Badge variant={getStatusBadgeVariant(goal.status)} className="flex items-center gap-1">
                                                    {getStatusIcon(goal.status)}
                                                    {goal.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-600 dark:text-neutral-400">Progress</span>
                                                    <span className="font-medium text-neutral-900 dark:text-white">
                                                        ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${getProgressPercentage(goal.currentAmount, goal.targetAmount)}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {getProgressPercentage(goal.currentAmount, goal.targetAmount).toFixed(1)}% complete
                                                </p>
                                            </div>

                                            {goal.deadline && (
                                                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                                                </div>
                                            )}

                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    onClick={() => handleStatusUpdate(goal.id, 'ACHIEVED')}
                                                    disabled={updateGoalMutation.isPending}
                                                    className="flex-1"
                                                >
                                                    Mark as Achieved
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStatusUpdate(goal.id, 'ABANDONED')}
                                                    disabled={updateGoalMutation.isPending}
                                                    className="flex-1"
                                                >
                                                    Abandon Goal
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Achieved Goals */}
                    {achievedGoals.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Achieved Goals
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {achievedGoals.map((goal) => (
                                    <Card key={goal.id} className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-lg text-neutral-900 dark:text-white">{goal.title}</CardTitle>
                                                    <Badge variant="default" className="w-fit bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                                        {goal.category.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <Badge variant={getStatusBadgeVariant(goal.status)} className="flex items-center gap-1">
                                                    {getStatusIcon(goal.status)}
                                                    {goal.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-600 dark:text-neutral-400">Target Amount</span>
                                                    <span className="font-medium text-neutral-900 dark:text-white">
                                                        ₹{goal.targetAmount.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                                                    <div className="bg-green-600 h-2 rounded-full w-full"></div>
                                                </div>
                                                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                    🎉 Goal achieved successfully!
                                                </p>
                                            </div>

                                            {goal.deadline && (
                                                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Achieved by: {new Date(goal.deadline).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Abandoned Goals */}
                    {abandonedGoals.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-red-500" />
                                Abandoned Goals
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {abandonedGoals.map((goal) => (
                                    <Card key={goal.id} className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-lg text-neutral-900 dark:text-white">{goal.title}</CardTitle>
                                                    <Badge variant="destructive" className="w-fit">
                                                        {goal.category.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <Badge variant={getStatusBadgeVariant(goal.status)} className="flex items-center gap-1">
                                                    {getStatusIcon(goal.status)}
                                                    {goal.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-600 dark:text-neutral-400">Target Amount</span>
                                                    <span className="font-medium text-neutral-900 dark:text-white">
                                                        ₹{goal.targetAmount.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-red-200 dark:bg-red-800 rounded-full h-2">
                                                    <div className="bg-red-600 h-2 rounded-full" style={{ width: `${getProgressPercentage(goal.currentAmount, goal.targetAmount)}%` }}></div>
                                                </div>
                                                <p className="text-xs text-red-600 dark:text-red-400">
                                                    Progress: {getProgressPercentage(goal.currentAmount, goal.targetAmount).toFixed(1)}%
                                                </p>
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStatusUpdate(goal.id, 'ACTIVE')}
                                                    disabled={updateGoalMutation.isPending}
                                                    className="flex-1"
                                                >
                                                    Reactivate Goal
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Goals State */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i} className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                                    <CardHeader>
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/4" />
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-2 w-full" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 w-1/2" />
                                            <Skeleton className="h-8 w-1/2" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : goals && goals.length === 0 ? (
                        <Card className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                            <CardContent className="text-center py-12">
                                <Target className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No goals yet</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                    Start your financial journey by creating your first goal
                                </p>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    Create Your First Goal
                                </Button>
                            </CardContent>
                        </Card>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
