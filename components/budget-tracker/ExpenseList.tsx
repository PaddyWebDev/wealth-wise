'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { editExpenseSchema, type EditExpenseFormData } from '@/lib/auth-form-schemas';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Expense } from '@prisma/client';
import { Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import queryClient from '@/lib/tanstack-query';
import { getSessionUser } from '@/hooks/user';

interface ExpenseListProps {
  budgetId: string;
}

export function ExpenseList({ budgetId }: ExpenseListProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<EditExpenseFormData>({
    resolver: zodResolver(editExpenseSchema),
    defaultValues: {
      category: '',
      amount: '',
      date: '',
    },
  });

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses', budgetId],
    queryFn: async () => {
      const sessionUser = await getSessionUser();
      const response = await axios.get(`/api/expenses?userId=${sessionUser?.user.id}`);
      return response.data.filter((expense: Expense) => expense.budgetId === budgetId);
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      const sessionUser = await getSessionUser();
      const response = await axios.delete(`/api/expenses/${expenseId}?userId=${sessionUser?.user.id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] });
      toast.success('Expense deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete expense');
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const session = await getSessionUser();
      const response = await axios.put(`/api/expenses/${id}?userId=${session?.user.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] });
      toast.success('Expense updated successfully!');
      setEditingExpense(null);
      setIsEditDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error('Failed to update expense');
    },
  });

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    form.reset({
      category: expense.category,
      amount: expense.amount.toString(),
      date: new Date(expense.date).toISOString().split('T')[0],
    });
    setIsEditDialogOpen(true);
  };

  const onSubmit = (data: EditExpenseFormData) => {
    if (editingExpense) {
      updateExpenseMutation.mutate({
        id: editingExpense.id,
        data: {
          category: data.category,
          amount: data.amount,
          date: data.date,
        },
      });
    }
  };

  const handleDelete = (expenseId: string) => {
    deleteExpenseMutation.mutate(expenseId);
  };

  if (isLoading) {
    return (
      <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-white">Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 dark:text-neutral-400">Loading expenses...</p>
        </CardContent>
      </Card>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-white">Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 dark:text-neutral-400">No expenses found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white">Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full">
          <div className="space-y-4">
            {expenses.map((expense: Expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">{expense.category}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">₹{expense.amount.toFixed(2)}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(expense)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='dark:bg-neutral-800 bg-neutral-100'>
                      <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
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
                          <Button type="submit" disabled={updateExpenseMutation.isPending}>
                            {updateExpenseMutation.isPending ? 'Updating...' : 'Update Expense'}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(expense.id)}
                    disabled={deleteExpenseMutation.isPending}
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
