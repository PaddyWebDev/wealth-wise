'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { addIncomeSchema, type AddIncomeFormData } from '@/lib/auth-form-schemas';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Budget } from '@prisma/client';

export interface AddIncomeExpenseProps {
  budgetId: string
}
export function AddIncomeForm({ budgetId }: AddIncomeExpenseProps) {
  const queryClient = useQueryClient();

  const form = useForm<AddIncomeFormData>({
    resolver: zodResolver(addIncomeSchema),
    defaultValues: {
      source: '',
      amount: '',
      date: '',
    },
  });

  const addIncomeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/incomes', {
        budgetId: budgetId,
        ...data
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] });
      toast.success('Income added successfully!');
      form.reset();
    },
    onError: () => {
      toast.error('Failed to add income');
    },
  });

  const onSubmit = (data: AddIncomeFormData) => {
    addIncomeMutation.mutate({
      source: data.source,
      amount: parseFloat(data.amount),
      date: data.date || undefined,
    });
  };

  return (
    <Card className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white">Add Income</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >Source</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g., Salary, Freelance"
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
                  <FormLabel >Date (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-900 text-neutral-900 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={addIncomeMutation.isPending}
            >
              {addIncomeMutation.isPending ? 'Adding...' : 'Add Income'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
