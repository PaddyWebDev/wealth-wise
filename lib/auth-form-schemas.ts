import { z } from "zod";

export const addIncomeSchema = z.object({
  source: z.string().min(1, "Source is required"),
  amount: z
    .string()
    .regex(/^\d*\.?\d+$/, "Amount must be a valid number") // Only digits and one dot allowed
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than 0",
    }),
  date: z.string().optional(),
});

export type AddIncomeFormData = z.infer<typeof addIncomeSchema>;

export const addExpenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z
    .string()
    .regex(/^\d*\.?\d+$/, "Amount must be a valid number") // Only digits and one dot allowed
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than 0",
    }),
  date: z.string().optional(),
});

export type AddExpenseFormData = z.infer<typeof addExpenseSchema>;
