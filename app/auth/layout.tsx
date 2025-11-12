import { auth } from "@/auth";
import React from "react";
import { SessionProvider } from "@/context/session";
import Sidebar from "@/components/auth-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import ThemeSwitcher from "@/components/theme-switcher";

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
        <main className="flex h-dvh w-dvw   dark:bg-neutral-950">
          {/* Sidebar */}
          <Sidebar
            userId={session.user.id!}
            userName={session.user.name!}
          />

          {/* Main content area with trigger */}
          <SidebarInset className=" bg-neutral-50 dark:bg-neutral-900">
            {/* Trigger should be visible at the top-left of content */}
            <header className="py-2 pl-3  pr-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 justify-between">
              <div className="flex flew-row items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                  Wealth Wise
                </h1>
              </div>

              <ThemeSwitcher />
            </header>

            {/* Page content */}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </SidebarInset>
        </main>
      </SessionProvider>
    </SidebarProvider>
  );
}
