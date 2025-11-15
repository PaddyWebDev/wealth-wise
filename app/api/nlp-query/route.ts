import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY! });

// Format Gemini response
function formatAIResponse(response: string): string {
  response = response.replace(/\*\*(.*?)\*\*/g, "**$1**");
  response = response.replace(/^\* /gm, "- ");
  response = response.replace(/\n\n/g, "\n\n");
  return response;
}

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

    // Fetch user's saved financial data
    const budgets = await prisma.budget.findMany({
      where: { userId: userId },
      include: { incomes: true, expenses: true },
    });

    const financialSummary = budgets
      .map((b) => {
        return `Month: ${b.month}, Income: ₹${b.totalIncome}, Expenses: ₹${b.totalExpenses}, Savings Goal: ₹${b.savingsGoal}, Actual Savings: ₹${b.actualSavings}.`;
      })
      .join(" ");

    const prompt = `
          You are a financial guidance AI.  
          User financial summary: ${financialSummary}.  
          Rules:
          1. Provide detailed suggestion for user's query but keep content short & informative.
          2. Do NOT give direct buy/sell advice.
          3. If asked about best stocks or sectors:
            - List examples of well-performing stocks from dynamic list.
          4. Add a disclaimer:
            "Please note that I do not directly recommend investing in any specific stocks. Conduct your own study and research before making any investment decisions."

          User query: ${query}
          `;

    const model = genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        tools: [
          {
            googleSearch: {},
          },
        ],
      },
    });

    let aiResponse = (await model).text || "Unable to generate a response.";

    aiResponse = formatAIResponse(aiResponse);

    // Save chat message
    await prisma.chatMessage.create({
      data: {
        userId,
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
