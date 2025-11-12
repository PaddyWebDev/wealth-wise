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

    // Prepare context for AI
    const context = {
      budgets: budgets.map((b) => ({
        month: b.month,
        totalIncome: b.totalIncome,
        totalExpenses: b.totalExpenses,
        savingsGoal: b.savingsGoal,
        actualSavings: b.actualSavings,
        incomes: b.incomes.map((i) => ({
          source: i.source,
          amount: i.amount,
          date: i.date,
        })),
        expenses: b.expenses.map((e) => ({
          category: e.category,
          amount: e.amount,
          date: e.date,
        })),
      })),
    };

    // Call Google Gemini for response
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a financial advisor AI. Respond to investment queries based on the user's financial data. Provide advice on investments, savings, budgeting, etc. Use the provided data to give personalized responses. Keep responses helpful, accurate, and neutral.
                    User query: ${query}
                    User financial data: ${JSON.stringify(context)}
    `;

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
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
