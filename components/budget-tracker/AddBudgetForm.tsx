'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { addBudgetSchema, type AddBudgetFormData } from '@/lib/auth-form-schemas';
import axios from 'axios';
import toast from 'react-hot-toast';
import queryClient from '@/lib/tanstack-query';
import { useState } from 'react';
import { Plus } from 'lucide-react';

export function AddBudgetForm() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<AddBudgetFormData>({
    resolver: zodResolver(addBudgetSchema),
    defaultValues: {
      month: '',
      savingsGoal: undefined,
    },
  });

  const addBudgetMutation = useMutation({
    mutationFn: async (data: AddBudgetFormData) => {
      const response = await axios.post('/api/budgets', {
        month: data.month,
        savingsGoal: data.savingsGoal || 0,
        actualSavings: 0,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget created successfully!');
      form.reset();
      setIsOpen(false);
    },
    onError: () => {
      toast.error('Failed to create budget');
    },
  });

  const onSubmit = (data: AddBudgetFormData) => {
    addBudgetMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button >
          <Plus className="w-4 h-4 "/>
          Create Budget
        </Button>
      </DialogTrigger>
      <DialogContent className=' bg-neutral-100 dark:bg-neutral-800'>
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month (YYYY-MM)</FormLabel>
                  <FormControl>
                    <Input placeholder="2024-01" {...field} />
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
      </DialogContent>
    </Dialog>
  );
}
