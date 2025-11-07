import { checkUserExistsByEmailAndPhoneNumber } from "@/hooks/user";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/hooks/password";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phoneNumber, gender } = await request.json();
    if (!name || !email || !password || !phoneNumber)
      return new NextResponse("Missing Fields", {
        status: 400,
      });

    const user = await checkUserExistsByEmailAndPhoneNumber(email, phoneNumber);
    if (user) {
      return new NextResponse("User already Exists", {
        status: 409,
      });
    }
    await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
        phoneNumber: phoneNumber,
        gender: gender,
      },
    });

    return new NextResponse("Uer Registered Successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
