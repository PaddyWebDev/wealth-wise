import { checkUserExistsByEmailAndPhoneNumber } from "@/hooks/user";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return new NextResponse("UserId is required", {
        status: 404,
      });
    }

    const data = await request.json();
    if (!data.name || !data.email || !data.phoneNumber) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        phoneNumber: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (
      user?.email === data.email ||
      data.phoneNumber === user?.phoneNumber ||
      data.name === user?.name
    ) {
      return new NextResponse("Modify the data to update", { status: 400 });
    }

    if (
      await checkUserExistsByEmailAndPhoneNumber(data.email, data.phoneNumber)
    ) {
      return new NextResponse("The email and phone is already in use");
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
      },
    });

    return new NextResponse("User updated", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
