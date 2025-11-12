"use server";

import { auth, signIn, signOut } from "@/auth";
import prisma from "@/lib/prisma";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

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

export async function getUserByIdForUpdate(id: string) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      email: true,
      phoneNumber: true,
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
      OR: [{ email: email }, { phoneNumber: phoneNumber }],
    },
    select: {
      id: true,
    },
  });
}

export async function checkUserExistsById(id: string): Promise<Boolean> {
  return !!(await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
    },
  }));
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

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      gender: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function socialLogin(provider: "github" | "google") {
  await signIn(provider, {
    callbackUrl: DEFAULT_LOGIN_REDIRECT,
  });
}

export async function fetchUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      gender: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
