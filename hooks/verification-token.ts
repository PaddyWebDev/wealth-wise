"use server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";

export async function generateVerificationToken(email: string) {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await prisma.verificationToken.findUnique({
    where: {
      email: email,
    },
    select: {
      token: true,
      id: true,
    },
  });
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const newToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expiresAt: expires,
    },
  });

  return newToken;
}
