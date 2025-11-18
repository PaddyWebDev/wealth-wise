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
  query: z
    .string()
    .min(1, "Query is required")
    .max(500, "Query should be maximum 500 characters"),
});

export type ChatFormType = z.infer<typeof chatFormSchema>;

export const recommendSchema = z.object({
  min_sip: z
    .string()
    .regex(
      /^(100|[1-9]\d{2}|[12]\d{3}|3000)$/,
      "SIP must be between ₹100 and ₹3000"
    ),
  required_return: z
    .string()
    .regex(
      /^(?:[1-9](?:\.\d+)?|[12][0-9](?:\.\d+)?|30(?:\.0+)?)$/,
      "Please enter a valid return between 1% and 30%"
    )
    .min(1, "Minimum return should be at least 1%")
    .max(30, "Maximum allowed return is 30%")
    .refine(
      (str) => Number(str) >= 1 && Number(str) <= 30,
      "Return must be valid number between 1 and 30"
    ),

  risk_level: z.string().min(1, "Risk level is required"),

  category: z.string().min(1, "Category is required"),
});
export const recommendLumpSumSchema = z.object({
  min_lumpsum: z
    .string()
    .regex(
      /^(1000|[1-9]\d{3}|[12]\d{4}|30000)$/,
      "Lumpsum must be between ₹1000 and ₹30000"
    ),
  required_return: z
    .string()
    .regex(
      /^(?:[1-9](?:\.\d+)?|[12][0-9](?:\.\d+)?|30(?:\.0+)?)$/,
      "Please enter a valid return between 1% and 30%"
    )
    .min(1, "Minimum return should be at least 1%")
    .max(30, "Maximum allowed return is 30%")
    .refine(
      (str) => Number(str) >= 1 && Number(str) <= 30,
      "Return must be valid number between 1 and 30"
    ),

  risk_level: z.string().min(1, "Risk level is required"),

  category: z.string().min(1, "Category is required"),
});

export type recommendationFormType = z.infer<typeof recommendSchema>;
export type recommendationLumpSumFormType = z.infer<
  typeof recommendLumpSumSchema
>;

export const mutualFundsCalculatorSchema = z
  .object({
    investmentType: z.enum(["lumpsum", "sip"]),
    principalAmount: z
      .string()
      .min(1, "Principal amount is required")
      .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount")
      .refine((val) => parseFloat(val) > 0, "Amount must be greater than 0"),
    monthlySip: z.string().optional(),
    annualReturnRate: z
      .string()
      .min(1, "Annual return rate is required")
      .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid percentage")
      .refine(
        (val) => parseFloat(val) >= 0 && parseFloat(val) <= 50,
        "Rate must be between 0% and 50%"
      ),
    timePeriod: z
      .string()
      .min(1, "Time period is required")
      .regex(/^\d+$/, "Enter a valid number of years")
      .refine(
        (val) => parseInt(val) > 0 && parseInt(val) <= 50,
        "Period must be between 1 and 50 years"
      ),
  })
  .refine(
    (data) => {
      if (
        data.investmentType === "sip" &&
        (!data.monthlySip || parseFloat(data.monthlySip) <= 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Monthly SIP is required for SIP investment",
      path: ["monthlySip"],
    }
  );

export type MutualFundsCalculatorFormType = z.infer<
  typeof mutualFundsCalculatorSchema
>;

export const editExpenseSchema = z.object({
  category: z
    .string()
    .min(1, "Category is required")
    .max(40, "Category must be only 40 characters only"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(
      /^(?!0*(?:\.0+)?$)\d+(\.\d+)?$/,
      "Amount must be a valid positive number"
    ),
  date: z.string().min(1, "Date is required"),
});

export const editIncomeSchema = z.object({
  source: z
    .string()
    .min(1, "Source is required")
    .max(40, "Source must be only 40 characters only"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(
      /^(?!0*(?:\.0+)?$)\d+(\.\d+)?$/,
      "Amount must be a valid positive number"
    ),
  date: z.string().min(1, "Date is required"),
});

export type EditExpenseFormData = z.infer<typeof editExpenseSchema>;
export type EditIncomeFormData = z.infer<typeof editIncomeSchema>;

export const addBudgetSchema = z.object({
  month: z
    .string()
    .min(1, 'Month is required')
    .regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format')
    .refine((val) => {
      const [year, month] = val.split('-').map(Number);
      return month >= 1 && month <= 12;
    }, 'Invalid month'),
  savingsGoal: z.number().min(0, 'Savings goal must be non-negative').optional(),
});

export type AddBudgetFormData = z.infer<typeof addBudgetSchema>;
