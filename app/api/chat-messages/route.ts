import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return new NextResponse("User Id is required", { status: 400 });
    }
    const messages = await prisma.chatMessage.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      {
        messageData: messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat Messages Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
