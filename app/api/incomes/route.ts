import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const incomes = await prisma.income.findMany({
      where: { budget: { user: { email: session.user.email } } },
      include: { budget: true },
    });

    return NextResponse.json(incomes);
  } catch (error) {
    console.error('Error fetching incomes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { budgetId, source, amount, date } = body;

    const budget = await prisma.budget.findFirst({
      where: { id: budgetId, user: { email: session.user.email } },
    });

    if (!budget) {
      return NextResponse.json({ error: 'Budget not found or unauthorized' }, { status: 404 });
    }

    const income = await prisma.income.create({
      data: {
        budgetId,
        source,
        amount,
        date: date ? new Date(date) : new Date(),
      },
    });

    // Update budget totals
    await prisma.budget.update({
      where: { id: budgetId },
      data: {
        totalIncome: { increment: amount },
        actualSavings: { increment: amount },
      },
    });

    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    console.error('Error creating income:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
