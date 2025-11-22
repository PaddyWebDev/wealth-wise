import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Fetch Goals Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goalId, status } = await request.json();

    if (!goalId || !status) {
      return NextResponse.json(
        { error: "Goal ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["ACTIVE", "ACHIEVED", "ABANDONED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be ACTIVE, ACHIEVED, or ABANDONED" },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.update({
      where: { id: goalId, userId: userId },
      data: { status },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Update Goal Error:", error);
    return NextResponse.json(
      { error: "Failed to update goal" },
      { status: 500 }
    );
  }
}
