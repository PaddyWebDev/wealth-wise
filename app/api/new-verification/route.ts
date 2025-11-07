import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return new NextResponse("Token is required", { status: 400 });
    const existingToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
      select: {
        id: true,
        expiresAt: true,
        email: true,
      },
    });
    if (!existingToken) {
      return new NextResponse("Token is required", { status: 404 });
    }
    const hasExpired = new Date(existingToken.expiresAt) < new Date();

    if (hasExpired) {
      return new NextResponse("Token Has Expired!", { status: 409 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: existingToken.email,
      },
      select: {
        id: true,
        emailVerified: true,
      },
    });
    if (!existingUser) {
      return new NextResponse("Email Doesn't Exist", { status: 404 });
    }

    if (existingUser.emailVerified) {
      return new NextResponse("User is already verified", { status: 409 });
    }

    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
