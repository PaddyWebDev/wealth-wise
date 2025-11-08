import { checkUserExistsByEmailAndPhoneNumber } from "@/hooks/user";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/hooks/password";
import { generateVerificationToken } from "@/hooks/verification-token";
import { sendVerificationEmail } from "@/hooks/email";

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();

    if (
      !data.name ||
      !data.email ||
      !data.password ||
      !data.phoneNumber ||
      !data.gender
    ) {
      return new NextResponse("Missing Fields", {
        status: 400,
      });
    }
    if (
      await checkUserExistsByEmailAndPhoneNumber(data.email, data.phoneNumber)
    ) {
      return new NextResponse("User already Exists", {
        status: 409,
      });
    }
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await hashPassword(data.password),
        phoneNumber: data.phoneNumber,
        gender: data.gender,
      },
    });

    const verificationToken = await generateVerificationToken(data.email);

    await sendVerificationEmail(data.email, verificationToken.token);

    return new NextResponse("User Registered Successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
