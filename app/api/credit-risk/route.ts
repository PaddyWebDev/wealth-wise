import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    // Fetch user's budgets with incomes and expenses
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: {
        incomes: true,
        expenses: true,
      },
    });

    // Fetch financial profile
    const profile = await prisma.financialProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return new NextResponse("Financial profile not found. Please complete your financial profile first.", { status: 404 });
    }

    // Calculate metrics
    const incomeAmounts = budgets.flatMap(b => b.incomes.map(i => i.amount));
    const expenseAmounts = budgets.flatMap(b => b.expenses.map(e => e.amount));
    const savingsRates = budgets.map(b => b.actualSavings / (b.totalIncome || 1)); // Avoid division by zero

    const incomeStability = calculateVariance(incomeAmounts);
    const spendingVolatility = calculateVariance(expenseAmounts);
    const averageSavingsRate = savingsRates.reduce((a, b) => a + b, 0) / savingsRates.length || 0;

    // Risk score calculation (lower score = higher risk)
    // Normalize metrics: higher variance = higher risk, lower savings = higher risk
    const incomeRisk = Math.min(incomeStability / 10000, 1); // Cap at 1
    const spendingRisk = Math.min(spendingVolatility / 10000, 1);
    const savingsRisk = 1 - averageSavingsRate; // Lower savings = higher risk

    const riskScore = (incomeRisk * 0.3) + (spendingRisk * 0.4) + (savingsRisk * 0.3);

    // Adjust based on personality type and risk tolerance
    let adjustment = 0;
    if (profile.personalityType === "SPENDER") adjustment += 0.2;
    if (profile.personalityType === "SAVER") adjustment -= 0.2;
    adjustment += (1 - profile.riskTolerance) * 0.1; // Lower tolerance = higher risk

    const finalScore = Math.max(0, Math.min(1, riskScore + adjustment));

    // Classify risk level
    let riskLevel: "Low" | "Medium" | "High";
    if (finalScore < 0.3) riskLevel = "Low";
    else if (finalScore < 0.7) riskLevel = "Medium";
    else riskLevel = "High";

    const details = {
      incomeStability: incomeStability.toFixed(2),
      spendingVolatility: spendingVolatility.toFixed(2),
      averageSavingsRate: (averageSavingsRate * 100).toFixed(2) + "%",
      personalityType: profile.personalityType,
      riskTolerance: profile.riskTolerance,
    };

    return NextResponse.json({
      riskLevel,
      score: finalScore.toFixed(2),
      details,
    });
  } catch (error) {
    console.error("Error assessing credit risk:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Helper function to calculate variance
function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return variance;
}
