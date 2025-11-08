"use server";

import prisma from "@/lib/prisma";
import { PasswordResetToken } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";


export async function getPasswordResetTokenByToken(
  token: string
): Promise<PasswordResetToken> {
  try {
    const passwordToken = await prisma.passwordResetToken.findUnique({
      where: {
        token: token,
      },
    });

    if (!passwordToken) {
      throw new Error("Token not found");
    }

    return passwordToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
export async function getPasswordResetTokenByEmail(
  email: string
): Promise<PasswordResetToken    | null> {
  try {
    const passwordToken = await prisma.passwordResetToken.findFirst({
      where: {
        email: email,
      },
    });

    return passwordToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function generatePasswordResetToken(
  email: string
): Promise<PasswordResetToken> {
  const token = uuidv4();
  const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const newToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt: expiresIn,
    },
  });

  return newToken;
}
