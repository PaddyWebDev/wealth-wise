'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import axios from 'axios';
import toast from 'react-hot-toast';

const formSchema = z.object({
  month: z.string().min(1, 'Month is required (e.g., 2024-01)'),
  totalIncome: z.number().min(0, 'Total income must be non-negative').optional(),
  totalExpenses: z.number().min(0, 'Total expenses must be non-negative').optional(),
  savingsGoal: z.number().min(0, 'Savings goal must be non-negative').optional(),
});

type FormData = z.infer<typeof formSchema>;

export function AddBudgetForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: '',
      totalIncome: undefined,
      totalExpenses: undefined,
      savingsGoal: undefined,
    },
  });

  const queryClient = useQueryClient();

  const addBudgetMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post('/api/budgets', {
        month: data.month,
        totalIncome: data.totalIncome || 0,
        totalExpenses: data.totalExpenses || 0,
        savingsGoal: data.savingsGoal || 0,
        actualSavings: 0,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget created successfully!');
      form.reset();
    },
    onError: () => {
      toast.error('Failed to create budget');
    },
  });

  const onSubmit = (data: FormData) => {
    addBudgetMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your First Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month (e.g., 2024-01)</FormLabel>
                  <FormControl>
                    <Input placeholder="2024-01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Income (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalExpenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Expenses (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="savingsGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Savings Goal (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={addBudgetMutation.isPending}>
              {addBudgetMutation.isPending ? 'Creating...' : 'Create Budget'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
