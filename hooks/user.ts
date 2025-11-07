"use server";

import { auth, signOut } from "@/auth";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export async function getSessionUser() {
  return await auth();
}

export async function getUserByEmailForPassVerification(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      password: true,
    },
  });
}

export async function getUserByIdForSessionToken(id: string) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      emailVerified: true,
      email: true,
      name: true,
      id: true,
    },
  });
}

export async function checkUserExistsByEmailAndPhoneNumber(
  email: string,
  phoneNumber: string
): Promise<{
  id: string;
} | null> {
  return await prisma.user.findUnique({
    where: {
      email: email,
      AND: {
        phoneNumber: phoneNumber,
      },
    },
    select: {
      id: true,
    },
  });
}

export async function SignOutUser() {
  await signOut();
}
