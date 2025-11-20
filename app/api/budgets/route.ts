import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return new NextResponse("User id is required", { status: 400 });
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
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      month,
      savingsGoal,
    } = body;

    if (!userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const budget = await prisma.budget.create({
      data: {
        userId,
        month,
        savingsGoal: savingsGoal || 0,
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("Error creating budget:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
