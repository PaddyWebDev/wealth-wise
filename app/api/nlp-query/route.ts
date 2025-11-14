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

    const prompt = `
        You are a financial guidance AI. Use the user's financial summary: ${financialSummary}.
        Rules:
        1. Do NOT give direct stock buy/sell advice.
        2. If the user asks about specific stocks or sectors:
          - Provide short sector insights (IT, Pharma, Banking, etc.).
          - Suggest safer alternatives: index funds, ETFs, sector mutual funds.
        3. Give concise, practical recommendations based on the user’s income, savings, and risk comfort.
        4. Keep answers short, structured, and actionable — avoid long paragraphs.
        5. If the question is outside personal finance, politely decline.
        6. Always prioritize safe, beginner-friendly financial guidance.

        User query: ${query}
        `;

    const result = await model.generateContent(prompt);
    let aiResponse =
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
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
