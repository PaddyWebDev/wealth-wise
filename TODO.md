# Dashboard Implementation TODO

## Step 1: Add getAllBudgets Hook
- Update hooks/budget.ts to include getAllBudgets server action for fetching all user budgets with incomes and expenses.

## Step 2: Update BudgetOverview Component
- Modify components/budget-tracker/BudgetOverview.tsx to accept budgets array, render multiple cards per month, and use neutral Tailwind colors (grays/slates).

## Step 3: Update Charts Component
- Modify components/budget-tracker/Charts.tsx to accept budgets array, aggregate real data for pie (expenses by category) and line (monthly savings/income/expenses), and use neutral colors.

## Step 4: Implement Dashboard Page
- Fully implement app/auth/dashboard/page.tsx to fetch budgets, integrate BudgetOverview, Charts, budget list, AddBudgetForm, and investment details section with neutral styling.

## Step 5: Fix TypeScript Errors
- Resolve TypeScript errors in dashboard page related to query function and type assertions.
