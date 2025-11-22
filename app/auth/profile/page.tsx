"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSessionContext } from '@/context/session'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUserById } from '@/hooks/user'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, Target } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { session } = useSessionContext()

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', session?.user?.id],
    queryFn: () => fetchUserById(session?.user?.id!),
    enabled: !!session?.user?.id,
  })

  if (!session?.user) {
    return <div className="flex items-center justify-center min-h-screen">No user session found.</div>
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">Error loading user data.</div>
  }

  if (!user && !isLoading) {
    return <div className="flex items-center justify-center min-h-screen">User not found.</div>
  }

  return (
    <div className="container mx-auto p-6 bg-neutral-50 dark:bg-neutral-900 min-h-fit">
      <div className="max-w-md mx-auto">
        <Card className="bg-white dark:bg-neutral-800 shadow-lg mt-[10dvh]">
          <CardHeader>
            <CardTitle className="text-neutral-800 dark:text-neutral-200">User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Name</label>
                {isLoading ? <Skeleton className="h-4 w-3/4" /> : <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{user?.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
                {isLoading ? <Skeleton className="h-4 w-full" /> : <p className="text-neutral-600 dark:text-neutral-400">{user?.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Phone Number</label>
                {isLoading ? <Skeleton className="h-4 w-1/2" /> : <p className="text-neutral-600 dark:text-neutral-400">{user?.phoneNumber}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Gender</label>
                {isLoading ? <Skeleton className="h-4 w-1/4" /> : <p className="text-neutral-600 dark:text-neutral-400">{user?.gender}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Account Created</label>
                {isLoading ? <Skeleton className="h-4 w-2/3" /> : <p className="text-neutral-600 dark:text-neutral-400">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Last Updated</label>
                {isLoading ? <Skeleton className="h-4 w-1/3" /> : <p className="text-neutral-600 dark:text-neutral-400">{user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : ''}</p>}
              </div>
            </div>
            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
