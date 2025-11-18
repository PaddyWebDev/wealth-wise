# TODO: Modify Backend Routes for Expenses, Incomes, and Budgets

## Overview
Modify all backend API routes for expenses, incomes, and budgets to:
- Remove calls to `auth()` function
- Use `getSessionUser` hook (though not directly called in routes, ensure frontend uses it to send userId)
- Expect `userId` sent from frontend in requests
- Validate users using `userId` instead of email for expenses and incomes

## Steps
1. **Modify app/api/expenses/route.ts**
   - Remove `auth` import and session checks
   - For GET: Extract `userId` from query params
   - For POST: Extract `userId` from request body
   - Update Prisma queries to filter by `user.id === userId`
   - Ensure budget validation uses `userId`

2. **Modify app/api/expenses/[id]/route.ts**
   - Remove `auth` import and session checks
   - For GET/PUT/DELETE: Extract `userId` from request body
   - Update Prisma queries to filter by `user.id === userId`
   - Handle budget updates with user validation

3. **Modify app/api/incomes/route.ts**
   - Remove `auth` import and session checks
   - For GET: Extract `userId` from query params
   - For POST: Extract `userId` from request body
   - Update Prisma queries to filter by `user.id === userId`
   - Ensure budget validation uses `userId`

4. **Modify app/api/incomes/[id]/route.ts**
   - Remove `auth` import and session checks
   - For PUT/DELETE: Extract `userId` from request body
   - Update Prisma queries to filter by `user.id === userId`
   - Handle budget updates with user validation

5. **Modify app/api/budgets/route.ts**
   - Remove `auth` import and session checks
   - For GET: Extract `userId` from query params
   - For POST: Extract `userId` from request body
   - Update Prisma queries to filter by `user.id === userId`

6. **Update Frontend Components**
   - Modify components to use `getSessionUser` hook to get `userId`
   - Send `userId` in all API requests (query params for GET, body for others)

7. **Test Changes**
   - Verify all routes work without auth
   - Ensure user validation is correct
   - Check budget calculations update properly
