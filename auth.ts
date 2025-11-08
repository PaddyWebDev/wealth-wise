import NextAuth, { type DefaultSession } from "next-auth";
import {
  getUserByIdForSessionToken,
} from "@/hooks/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/guest-form-schemas";
import bcryptjs from "bcryptjs";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
export const {
  auth,
  signOut,
  signIn,
  handlers: { GET, POST },
} = NextAuth({
  pages: {
    signIn: "/guest/Login",
    error: "/guest/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow non credential user to login without email verification
      if (account?.provider !== "credentials") {
        return true;
      }

      // Prevent SignIn without email Verification
      const existingUser = await getUserByIdForSessionToken(user.id!);
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (!token.sub) return token;

      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      const existingUser = await getUserByIdForSessionToken(token.sub);
      if (!existingUser) return token;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
            },
          });
          if (!user || !user.password) {
            return null;
          }

          const verifyPass = await bcryptjs.compare(password, user.password);
          if (verifyPass) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
});
