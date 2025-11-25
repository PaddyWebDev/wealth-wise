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

    const checkUserExistWithEmail = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
      },
    });

    const checkUserExistWithPhoneNumber = await prisma.user.findUnique({
      where: {
        phoneNumber: data.phoneNumber,
      },
      select: {
        id: true,
      },
    });

    if (checkUserExistWithEmail) {
      return new NextResponse("This email already exists in the system", {
        status: 409,
      });
    }

    if (checkUserExistWithPhoneNumber) {
      return new NextResponse(
        "This phone number already exists in the system",
        {
          status: 409,
        }
      );
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
