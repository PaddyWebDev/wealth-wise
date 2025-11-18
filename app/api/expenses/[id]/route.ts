import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const expenseId = params.id;

    if (!expenseId) {
      return NextResponse.json(
        { error: "Expense ID required" },
        { status: 400 }
      );
    }

    // Find the expense and ensure it belongs to the user
    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        budget: { userId: userId },
      },
      select: { amount: true, budgetId: true },
    });

    if (!expense) {
      return NextResponse.json(
        { error: "Expense not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the expense
    await prisma.expense.delete({
      where: { id: expenseId },
    });

    // Update budget totals
    await prisma.budget.update({
      where: { id: expense.budgetId },
      data: {
        totalExpenses: { decrement: expense.amount },
      },
    });

    // Recalculate actualSavings as totalIncome - totalExpenses
    const updatedBudget = await prisma.budget.findUnique({
      where: { id: expense.budgetId },
      select: { totalIncome: true, totalExpenses: true },
    });

    if (updatedBudget) {
      await prisma.budget.update({
        where: { id: expense.budgetId },
        data: {
          actualSavings:
            updatedBudget.totalIncome - updatedBudget.totalExpenses,
        },
      });
    }

    return NextResponse.json(
      { message: "Expense deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const { category, amount, date } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const expenseId = params.id;

    if (!expenseId) {
      return NextResponse.json(
        { error: "Expense ID required" },
        { status: 400 }
      );
    }

    // Find the expense and ensure it belongs to the user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        budget: { user: { id: userId } },
      },
      select: { amount: true, budgetId: true },
    });

    if (!existingExpense) {
      return NextResponse.json(
        { error: "Expense not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update the expense
    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        category,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
      },
    });

    // Update budget totals
    const amountDifference = parseFloat(amount) - existingExpense.amount;
    await prisma.budget.update({
      where: { id: existingExpense.budgetId },
      data: {
        totalExpenses: { increment: amountDifference },
      },
    });

    // Recalculate actualSavings as totalIncome - totalExpenses
    const updatedBudget = await prisma.budget.findUnique({
      where: { id: existingExpense.budgetId },
      select: { totalIncome: true, totalExpenses: true },
    });

    if (updatedBudget) {
      await prisma.budget.update({
        where: { id: existingExpense.budgetId },
        data: {
          actualSavings:
            updatedBudget.totalIncome - updatedBudget.totalExpenses,
        },
      });
    }

    return NextResponse.json(updatedExpense, { status: 200 });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
