'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { editIncomeSchema, type EditIncomeFormData } from '@/lib/auth-form-schemas';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Income } from '@prisma/client';
import { Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import queryClient from '@/lib/tanstack-query';
import { useSessionContext } from '@/context/session';

interface IncomeListProps {
  budgetId: string;
}

export function IncomeList({ budgetId }: IncomeListProps) {
  const { session } = useSessionContext()
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<EditIncomeFormData>({
    resolver: zodResolver(editIncomeSchema),
    defaultValues: {
      source: '',
      amount: '',
      date: '',
    },
  });

  const { data: incomes, isLoading } = useQuery({
    queryKey: ['incomes', budgetId],
    queryFn: async () => {

      const response = await axios.get(`/api/incomes?userId=${session?.user.id}`);
      return response.data.filter((income: Income) => income.budgetId === budgetId);
    },
  });

  const deleteIncomeMutation = useMutation({
    mutationFn: async (incomeId: string) => {
      const response = await axios.delete(`/api/incomes/${incomeId}?userId=${session?.user.id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] });
      toast.success('Income deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete income');
    },
  });

  const updateIncomeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.put(`/api/incomes/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] });
      toast.success('Income updated successfully!');
      setEditingIncome(null);
      setIsEditDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error('Failed to update income');
    },
  });

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    form.reset({
      source: income.source,
      amount: income.amount.toString(),
      date: new Date(income.date).toISOString().split('T')[0],
    });
    setIsEditDialogOpen(true);
  };

  const onSubmit = (data: EditIncomeFormData) => {
    if (editingIncome) {
      updateIncomeMutation.mutate({
        id: editingIncome.id,
        data: {
          source: data.source,
          amount: data.amount,
          date: data.date,
        },
      });
    }
  };

  const handleDelete = (incomeId: string) => {
    deleteIncomeMutation.mutate(incomeId);
  };

  if (isLoading) {
    return (
      <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-white">Incomes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 dark:text-neutral-400">Loading incomes...</p>
        </CardContent>
      </Card>
    );
  }

  if (!incomes || incomes.length === 0) {
    return (
      <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-white">Incomes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 dark:text-neutral-400">No incomes found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white">Incomes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full">
          <div className="space-y-4">
            {incomes.map((income: Income) => (
              <div key={income.id} className="flex items-center justify-between p-4 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">{income.source}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">₹{income.amount.toFixed(2)}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">{new Date(income.date).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(income)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className=' bg-neutral-100 dark:bg-neutral-800'>
                      <DialogHeader>
                        <DialogTitle>Edit Income</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="source"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Source</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" disabled={updateIncomeMutation.isPending}>
                            {updateIncomeMutation.isPending ? 'Updating...' : 'Update Income'}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(income.id)}
                    disabled={deleteIncomeMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
