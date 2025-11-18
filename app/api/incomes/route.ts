import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const incomes = await prisma.income.findMany({
      where: { budget: { user: { id: userId } } },
      include: { budget: true },
    });

    return NextResponse.json(incomes);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, budgetId, source, amount, date } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const budget = await prisma.budget.findFirst({
      where: { id: budgetId, user: { id: userId } },
      select: {
        month: true,
      },
    });

    if (!budget) {
      return NextResponse.json(
        { error: "Budget not found or unauthorized" },
        { status: 404 }
      );
    }

    const income = await prisma.income.create({
      data: {
        budgetId,
        source,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
      },
    });

    // Update budget totals
    await prisma.budget.update({
      where: { id: budgetId },
      data: {
        totalIncome: { increment: parseFloat(amount) },
      },
    });

    // Recalculate actualSavings as totalIncome - totalExpenses
    const updatedBudget = await prisma.budget.findUnique({
      where: { id: budgetId },
      select: { totalIncome: true, totalExpenses: true },
    });

    if (updatedBudget) {
      await prisma.budget.update({
        where: { id: budgetId },
        data: {
          actualSavings: updatedBudget.totalIncome - updatedBudget.totalExpenses,
        },
      });
    }

    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    console.error("Error creating income:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
