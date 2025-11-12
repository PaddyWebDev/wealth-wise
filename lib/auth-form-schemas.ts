import { z } from "zod";

export const addIncomeSchema = z.object({
  source: z.string().min(1, "Source is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(
      /^(?!0*(?:\.0+)?$)\d+(\.\d+)?$/,
      "Amount must be a valid positive number"
    ),
  date: z.string().optional(),
});

export type AddIncomeFormData = z.infer<typeof addIncomeSchema>;

export const addExpenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(
      /^(?!0*(?:\.0+)?$)\d+(\.\d+)?$/,
      "Amount must be a valid positive number"
    ),
  date: z.string().optional(),
});

export type AddExpenseFormData = z.infer<typeof addExpenseSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  email: z.email().min(5, "Email should be at least 5 characters"),
  phoneNumber: z.string().regex(/^\d{10}$/, {
    message: "Please enter a valid 10-digit phone number.",
  }),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Current and old passwords are same",
    path: ["newPassword"],
  });

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;


export const chatFormSchema = z.object({
  query: z.string().min(1, "Query is required").max(500, "Query should be maximum 500 characters")
})

export type ChatFormType = z.infer<typeof chatFormSchema>
