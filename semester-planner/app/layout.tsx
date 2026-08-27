import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppSidebar from "@/components/appSidebar";
import AppFooter from "@/components/appFooter";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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

            {/* auf mobile rendert Sidebar als geschlossenes Sheet, der trigger darin ist dann mit eingesperrt */}
            <SidebarTrigger className="md:hidden fixed top-3 left-3 z-50 bg-muted/60 backdrop-blur-sm" />

            <main className="w-full">
              <div className="w-full min-h-full flex flex-col justify-center items-center mx-auto pb-9">
                {children}
              </div>
              <AppFooter />

            </main>

          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
