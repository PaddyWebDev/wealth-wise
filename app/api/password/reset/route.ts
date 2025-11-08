import { hashPassword, verifyPassword } from "@/hooks/password";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return new NextResponse("Token is required");
    }

    const checkToken = await prisma.passwordResetToken.findUnique({
      where: {
        token: token,
      },
      select: {
        id: true,
        expiresAt: true,
        email: true,
      },
    });

    if (!checkToken) {
      return new NextResponse("Token doesn't exist on our system", {
        status: 404,
      });
    }

    if (checkToken.expiresAt < new Date()) {
      return new NextResponse("Token has expired", { status: 401 });
    }

    const { newPassword } = (await request.json()).data;

    if (!newPassword) {
      return new NextResponse("Missing Fields", {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: checkToken.email,
      },
      select: {
        password: true,
      },
    });

    if (!user)
      return new NextResponse("User not found", {
        status: 404,
      });

    if (!user.password)
      return new NextResponse(
        "This account doesn't support email password login",
        { status: 400 }
      );

    await prisma.user.update({
      data: {
        password: await hashPassword(newPassword),
      },
      where: {
        email: checkToken.email,
      },
    });

    return new NextResponse("Password Updated Successfully", {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}
