"use server";

import { auth, signIn, signOut } from "@/auth";
import prisma from "@/lib/prisma";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
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

export async function checkUserExistsByEmail(email: string): Promise<{
  id: string;
} | null> {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });
}

export async function SignOutUser() {
  await signOut();
}

export async function socialLogin(provider: "github" | "google") {
  await signIn(provider, {
    callbackUrl: DEFAULT_LOGIN_REDIRECT,
  });
}
