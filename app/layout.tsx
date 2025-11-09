import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/providers/theme";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/tanstack-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

const archivo = Archivo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WealthWise",
  description:
    "Notezzy is a note taking application built with Next.js 14 and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={archivo.className}>
        <SessionProvider>
          <SidebarProvider>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              // disableTransitionOnChange
              >
                <Toaster position="top-right" reverseOrder={false} />
                {children}
              </ThemeProvider>
            </QueryClientProvider>
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
