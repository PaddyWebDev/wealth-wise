import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";

import { verifyPassword } from "@/hooks/password";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        emailVerified: true,
        password: true,
      },
    });
    if (!user) {
      return new NextResponse("User doesn't exist", { status: 404 });
    }

    if (!user.emailVerified) {
      return new NextResponse("User not verified!", { status: 409 });
    }

    if (!user.password) {
      return new NextResponse(
        "This account doesn't allow email & password login",
        { status: 403 }
      );
    }

    if (!(await verifyPassword(password, user.password!))) {
      return new NextResponse("Password is incorrect", { status: 401 });
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return new NextResponse("Login Success", { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
