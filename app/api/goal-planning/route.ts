import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user's financial profile
    const profile = await prisma.financialProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        {
          error:
            "Financial profile not found. Please complete your financial profile first.",
        },
        { status: 404 }
      );
    }

    // Fetch user's budgets for context (last 6 months)
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { incomes: true, expenses: true },
      orderBy: { month: "desc" },
      take: 6,
    });

    const financialSummary = budgets
      .map(
        (b) =>
          `Month: ${b.month}, Income: ₹${b.totalIncome.toFixed(
            0
          )}, Expenses: ₹${b.totalExpenses.toFixed(
            0
          )}, Savings: ₹${b.actualSavings.toFixed(0)}`
      )
      .join("\n");

    // Calculate averages
    const avgIncome =
      budgets.reduce((sum, b) => sum + b.totalIncome, 0) /
      Math.max(budgets.length, 1);
    const avgSavings =
      budgets.reduce((sum, b) => sum + b.actualSavings, 0) /
      Math.max(budgets.length, 1);
    const calculatedSavingsRate =
      avgIncome > 0 ? (avgSavings / avgIncome) * 100 : 0;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert financial advisor. Generate 5 personalized, realistic financial goals for this user based on their profile and budget history. Goals must be dynamic and tailored to their specific situation - no generic suggestions.

User Profile:
- Personality Type: ${profile.personalityType}
- Savings Rate: ${
      profile.savingsRate
    }% (calculated from data: ${calculatedSavingsRate.toFixed(1)}%)
- Risk Tolerance: ${profile.riskTolerance} (0-1 scale)
- Spending Habits: ${JSON.stringify(profile.spendingHabits || {})}

Budget History (last 6 months):
${financialSummary}

Average Monthly Income: ₹${avgIncome.toFixed(0)}
Average Monthly Savings: ₹${avgSavings.toFixed(0)}

Requirements:
1. Generate exactly 5 unique goals
2. Each goal must be achievable based on their income and savings rate
3. Consider personality: Conservative = safety-focused, Spender = discipline-building, Saver = growth-oriented
4. Include Indian context (rupees, common goals like emergency fund, home down payment, retirement)
5. Timeframes: 6-60 months, realistic for their finances
6. Target amounts: Realistic based on income (e.g., 3-12 months income for emergency fund)

Output ONLY valid JSON array:
[
  {
    "goalName": "Specific goal name",
    "targetAmount": number,
    "timeframeMonths": number,
    "rationale": "2-3 sentences explaining why this goal fits their profile and finances",
    "priority": "high|medium|low",
    "category": "emergency|lifestyle|investment|debt|wealth"
  }
]`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    let goals;
    try {
      goals = JSON.parse(aiResponse);
    } catch {
      // Fallback if parsing fails
      goals = [];
    }

    return NextResponse.json(goals);
  } catch (error) {
    console.error("AI Goal Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate goals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) return new NextResponse("UserId is required", { status: 400 });
    const { goalName, targetAmount, timeframeMonths, currentSavings } =
      await request.json();

    if (
      !goalName ||
      !targetAmount ||
      !timeframeMonths ||
      currentSavings === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const target = parseFloat(targetAmount);
    const months = parseInt(timeframeMonths);
    const savings = parseFloat(currentSavings);

    if (target <= 0 || months <= 0 || savings < 0) {
      return NextResponse.json(
        { error: "Invalid input values" },
        { status: 400 }
      );
    }

    // Fetch profile
    const profile = await prisma.financialProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Financial profile not found" },
        { status: 404 }
      );
    }

    // Fetch user's budgets for context (last 6 months)
    const budgets = await prisma.budget.findMany({
      where: { userId },
      orderBy: { month: "desc" },
      take: 6,
    });

    const avgIncome =
      budgets.length > 0
        ? budgets.reduce((sum, b) => sum + b.totalIncome, 0) / budgets.length
        : 0;
    const avgExpense =
      budgets.length > 0
        ? budgets.reduce((sum, b) => sum + b.totalExpenses, 0) / budgets.length
        : 0;

    const budgetSummary = budgets
      .map(
        (b) =>
          `Month: ${b.month}, Income: ₹${b.totalIncome.toFixed(
            0
          )}, Expenses: ₹${b.totalExpenses.toFixed(0)}, Savings: ₹${b.actualSavings.toFixed(0)}`
      )
      .join("\n");

    const savingsRate = profile.savingsRate / 100;
    const maxSavings = avgIncome * savingsRate;

    const remaining = Math.max(0, target - savings); // Ensure remaining is not negative
    const requiredMonthly = months > 0 ? remaining / months : 0;
    
    const isFeasible = requiredMonthly <= maxSavings || remaining === 0;
    const timeToGoalMonths =
      maxSavings > 0 ? remaining / maxSavings : remaining > 0 ? Infinity : 0;
    const timeToGoalYears = isFinite(timeToGoalMonths)
      ? timeToGoalMonths / 12
      : Infinity;

    // Generate AI strategies
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const strategyPrompt = `Generate 4 personalized strategies for this user to achieve their financial goal. Make them specific, actionable, and tailored to their personality. Analyze their budget history to suggest optimizations where possible.
        Goal: ${goalName}
        Target: ₹${target}
        Timeframe: ${months} months
        Current Savings: ₹${savings}
        Required Monthly: ₹${requiredMonthly.toFixed(0)}
        Feasible: ${isFeasible}
        Avg Income: ₹${avgIncome.toFixed(0)}
        Avg Expenses: ₹${avgExpense.toFixed(0)}
        Budget History: ${budgetSummary}
        Personality: ${profile.personalityType}
        Risk Tolerance: ${profile.riskTolerance}

        Output ONLY JSON array:
        [
          {
            "type": "strategy_type",
            "suggestion": "Short title",
            "impact": "Expected benefit"
          }
        ]`;

    const result = await model.generateContent(strategyPrompt);
    const aiResponse = result.response.text();

    let strategies;
    try {
      strategies = JSON.parse(aiResponse);
    } catch {
      strategies = [
        {
          type: "budgeting",
          suggestion: "Optimize Budget",
          impact: "Increase savings capacity",
        },
        {
          type: "tracking",
          suggestion: "Track Progress",
          impact: "Maintain motivation",
        },
        {
          type: "automation",
          suggestion: "Automate Savings",
          impact: "Ensure consistency",
        },
        {
          type: "education",
          suggestion: "Financial Education",
          impact: "Better decision making",
        },
      ];
    }

    // Create the goal in the database
    const goal = await prisma.goal.create({
      data: {
        userId,
        title: goalName,
        targetAmount: target,
        currentAmount: savings,
        deadline: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000), // Approximate deadline
        category: "OTHER", // Default, can be updated later
        status: "ACTIVE",
        strategies: JSON.stringify(strategies),
      },
    });

    const response = {
      goal,
      goalName,
      targetAmount: target,
      timeframeMonths: months,
      currentSavings: savings,
      feasibility: {
        isFeasible,
        requiredMonthlyContribution: requiredMonthly.toFixed(0),
        maxMonthlySavings: maxSavings.toFixed(0),
        averageMonthlyIncome: avgIncome.toFixed(0),
      },
      timeToGoal: {
        months: timeToGoalMonths.toFixed(1),
        years: timeToGoalYears.toFixed(1),
      },
      strategies,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Goal Planning Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
