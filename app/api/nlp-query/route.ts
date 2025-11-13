import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return new NextResponse("UserId is required", { status: 400 });
    }
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Fetch user's financial data
    const budgets = await prisma.budget.findMany({
      where: { userId: userId },
      include: {
        incomes: true,
        expenses: true,
      },
    });

    const financialSummary = budgets
      .map((b) => {
        return `Month: ${b.month}, Income: ₹${b.totalIncome}, Expenses: ₹${b.totalExpenses}, Savings Goal: ₹${b.savingsGoal}, Actual Savings: ₹${b.actualSavings}.`;
      })
      .join(" ");

    // Call Google Gemini for response
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a financial advisor AI. The user has the following financial summary: ${financialSummary}.
        Guidelines:
        1. Do NOT provide direct buy/sell recommendations for individual stocks.
        2. If the user asks about specific stocks, instead provide:
          - Sector analysis (e.g., IT, Pharma, Banking) with trends and growth potential
          - Investment options aligned with the sector (mutual funds, ETFs, index funds)
          - Recommendations tailored to the user's financial capacity, including income, savings, and risk profile
        3. Provide personalized recommendations on:
          - Investment options suitable for their savings and income
          - Ways to improve savings
          - Budgeting tips
        4. Focus strictly on their financial context and prioritize advice that is actionable yet safe.
        5. If the user asks about unrelated topics or requests specific stock picks, politely inform them that you cannot provide advice in that domain.

        User query: ${query}`;

    const result = await model.generateContent(prompt);
    const aiResponse =
      result.response.text() || "Sorry, I could not generate a response.";

    // Save chat message to database
    await prisma.chatMessage.create({
      data: {
        userId: userId,
        message: query,
        response: aiResponse,
      },
    });

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.log(error)
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
