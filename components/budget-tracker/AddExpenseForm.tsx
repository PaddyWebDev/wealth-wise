'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import axios from 'axios';
import toast from 'react-hot-toast';
import React from 'react';
import { AddExpenseFormData, addExpenseSchema } from '@/lib/auth-form-schemas'
import { AddIncomeExpenseProps } from './AddIncomeForm';



export function AddExpenseForm({ budgetId }: AddIncomeExpenseProps) {
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<AddExpenseFormData>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      category: "",
      amount: "",
      date: "",
    },
  });

  const queryClient = useQueryClient();

  const addExpenseMutation = useMutation({
    mutationFn: async (data: AddExpenseFormData) => {
      const response = await axios.post('/api/expenses', {
        budgetId: budgetId,
        ...data,
        amount: data.amount,
        date: data.date || undefined,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] });
      toast.success('Expense added successfully!');
      form.reset({
        category: "",
        amount: "",
        date: ""
      });
    },
    onError: () => {
      toast.error('Failed to add expense');
    },
  });

  const onSubmit = (data: AddExpenseFormData) => {
    startTransition(() => addExpenseMutation.mutate(data))

  };

  return (
    <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-900 text-neutral-900 dark:text-white"
                      placeholder="e.g., Food, Transport" disabled={isPending} {...field} />
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
                  <FormLabel >Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="0.00"
                      className="bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-900 text-neutral-900 dark:text-white"
                      {...field}
                    />
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
                  <FormLabel>Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date"
                      className="bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-900 text-neutral-900 dark:text-white"
                      disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={addExpenseMutation.isPending}>
              {addExpenseMutation.isPending ? 'Adding...' : 'Add Expense'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
