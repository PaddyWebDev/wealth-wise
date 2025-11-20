import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  try {
    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        Budget: {
          include: {
            incomes: true,
            expenses: true,
          },
        },
        FinancialProfile: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }

    // If profile exists, return it
    if (user.FinancialProfile) {
      return NextResponse.json(user.FinancialProfile);
    }

    // Compute profile from transactions
    const budgets = user.Budget;
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalSavings = 0;
    const categoryExpenses: { [key: string]: number } = {};

    budgets.forEach((budget: any) => {
      totalIncome += budget.totalIncome;
      totalExpenses += budget.totalExpenses;
      totalSavings += budget.actualSavings;

      budget.expenses.forEach((expense: any) => {
        categoryExpenses[expense.category] =
          (categoryExpenses[expense.category] || 0) + expense.amount;
      });
    });

    const savingsRate =
      totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

    // Simple personality classification
    let personalityType:
      | "CONSERVATIVE"
      | "BALANCED"
      | "AGGRESSIVE"
      | "SPENDER"
      | "SAVER" = "BALANCED";
    let riskTolerance: number = 0.5;
    let advice: string = "Default advice";

    if (savingsRate > 30) {
      personalityType = "SAVER";
      riskTolerance = 0.2;
      advice =
        "You are a disciplined saver. Consider investing in low-risk options to grow your savings.";
    } else if (savingsRate > 20) {
      personalityType = "BALANCED";
      riskTolerance = 0.5;
      advice =
        "You have a balanced approach. Diversify your investments for steady growth.";
    } else if (savingsRate > 10) {
      personalityType = "AGGRESSIVE";
      riskTolerance = 0.8;
      advice =
        "You are willing to take risks. Focus on high-growth investments but maintain an emergency fund.";
    } else if (totalExpenses > totalIncome * 0.9) {
      personalityType = "SPENDER";
      riskTolerance = 0.1;
      advice =
        "You enjoy spending. Create a budget to build savings and reduce debt.";
    } else {
      personalityType = "CONSERVATIVE";
      riskTolerance = 0.3;
      advice =
        "You are cautious. Build confidence with low-risk investments before exploring more.";
    }

    const profile = await prisma.financialProfile.create({
      data: {
        userId: user.id,
        personalityType,
        riskTolerance,
        savingsRate,
        spendingHabits: categoryExpenses,
        advice,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching financial profile:", error);
    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}
