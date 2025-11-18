import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const budgets = await prisma.budget.findMany({
      where: { userId: userId },
      include: {
        incomes: true,
        expenses: true,
      },
    });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      month,
      totalIncome,
      totalExpenses,
      savingsGoal,
      actualSavings,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const budget = await prisma.budget.create({
      data: {
        userId,
        month,
        totalIncome: totalIncome || 0,
        totalExpenses: totalExpenses || 0,
        savingsGoal: savingsGoal || 0,
        actualSavings: actualSavings || 0,
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
