import { auth } from "@/auth";
import React from "react";
import { SessionProvider } from "@/context/session"; // Import Context
import Sidebar from "@/components/auth-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/guest/Login");
  }
  return (
    <SidebarProvider>
      <SessionProvider session={session}>
        <main className="w-full h-screen dark:bg-neutral-950">
          <aside className="md:w-64">
            <Sidebar
              userId={session?.user.id!}
              userName={session?.user.name!}
            />
          </aside>
          <SidebarTrigger />
          {children}
        </main>
      </SessionProvider>
    </SidebarProvider>
  );
}
