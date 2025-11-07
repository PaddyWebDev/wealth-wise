import { auth } from "@/auth";
import React from "react";
import Navbar from "@/components/guest-navbar";
import { getSessionUser } from "@/hooks/user";
import { redirect } from "next/navigation";

interface GuestLayoutProps {
  children: React.ReactNode;
}

export default async function GuestLayout({ children }: GuestLayoutProps) {
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    redirect("/auth/dashboard");
  }
  return (
    <main className="h-dvh bg-neutral-50 dark:bg-neutral-900 w-full">
      <Navbar />
      <section className="flex items-center w-full h-[92dvh] justify-center">
        {children}
      </section>
    </main>
  );
}
