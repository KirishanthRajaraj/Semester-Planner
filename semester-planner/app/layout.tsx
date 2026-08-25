import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppSidebar from "@/components/appSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Semester Planner",
  description: "Plane dein Semester mit wenig pflegeaufwand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="dark">
        <TooltipProvider>
          <SidebarProvider
            defaultOpen={false}
            className=""
          >
            <AppSidebar />

            <main className="w-full min-h-full flex flex-col justify-center items-center mx-auto">
              {children}
            </main>

          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
