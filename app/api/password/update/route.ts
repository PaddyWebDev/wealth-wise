import { hashPassword, verifyPassword } from "@/hooks/password";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return new NextResponse("User id is required", {
        status: 400,
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }
    const data = await request.json();

    if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    if (data.newPassword !== data.confirmPassword) {
      return new NextResponse("Password Confirmation Failed", { status: 400 });
    }

    if (!verifyPassword(user.password, data.currentPassword)) {
      return new NextResponse(
        "Old password doesn't match with the system stored",
        { status: 409 }
      );
    }

    if (data.currentPassword === data.newPassword) {
      return new NextResponse(
        "Previous password and current password are same",
        {
          status: 409,
        }
      );
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await hashPassword(data.newPassword),
      },
    });
    return new NextResponse("Password updated successfully", {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}
