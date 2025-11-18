import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const incomeId = params.id;

    if (!incomeId) {
      return NextResponse.json({ error: "Income ID required" }, { status: 400 });
    }

    // Find the income and ensure it belongs to the user
    const income = await prisma.income.findFirst({
      where: {
        id: incomeId,
        budget: { user: { id: userId } },
      },
      select: { amount: true, budgetId: true },
    });

    if (!income) {
      return NextResponse.json({ error: "Income not found or unauthorized" }, { status: 404 });
    }

    // Delete the income
    await prisma.income.delete({
      where: { id: incomeId },
    });

    // Update budget totals
    await prisma.budget.update({
      where: { id: income.budgetId },
      data: {
        totalIncome: { decrement: income.amount },
      },
    });

    // Recalculate actualSavings as totalIncome - totalExpenses
    const updatedBudget = await prisma.budget.findUnique({
      where: { id: income.budgetId },
      select: { totalIncome: true, totalExpenses: true },
    });

    if (updatedBudget) {
      await prisma.budget.update({
        where: { id: income.budgetId },
        data: {
          actualSavings: updatedBudget.totalIncome - updatedBudget.totalExpenses,
        },
      });
    }

    return NextResponse.json({ message: "Income deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting income:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { userId, source, amount, date } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const incomeId = params.id;

    if (!incomeId) {
      return NextResponse.json({ error: "Income ID required" }, { status: 400 });
    }

    // Find the income and ensure it belongs to the user
    const existingIncome = await prisma.income.findFirst({
      where: {
        id: incomeId,
        budget: { user: { id: userId } },
      },
      select: { amount: true, budgetId: true },
    });

    if (!existingIncome) {
      return NextResponse.json({ error: "Income not found or unauthorized" }, { status: 404 });
    }

    // Update the income
    const updatedIncome = await prisma.income.update({
      where: { id: incomeId },
      data: {
        source,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
      },
    });

    // Update budget totals
    const amountDifference = parseFloat(amount) - existingIncome.amount;
    await prisma.budget.update({
      where: { id: existingIncome.budgetId },
      data: {
        totalIncome: { increment: amountDifference },
      },
    });

    // Recalculate actualSavings as totalIncome - totalExpenses
    const updatedBudget = await prisma.budget.findUnique({
      where: { id: existingIncome.budgetId },
      select: { totalIncome: true, totalExpenses: true },
    });

    if (updatedBudget) {
      await prisma.budget.update({
        where: { id: existingIncome.budgetId },
        data: {
          actualSavings: updatedBudget.totalIncome - updatedBudget.totalExpenses,
        },
      });
    }

    return NextResponse.json(updatedIncome, { status: 200 });
  } catch (error) {
    console.error("Error updating income:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
