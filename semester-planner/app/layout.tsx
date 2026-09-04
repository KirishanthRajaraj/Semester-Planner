import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppSidebar from "@/components/appSidebar";
import AppFooter from "@/components/appFooter";
import ClientOnly from "@/components/clientOnly";
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
  description: "Tree based bulk planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="light"){document.documentElement.classList.remove("dark")}}catch(e){}`,
          }}
        />
        <TooltipProvider>
          <SidebarProvider
            defaultOpen={false}
            className=""
          >
            <AppSidebar />

            <SidebarTrigger className="md:hidden fixed top-3 left-3 z-50 size-11 rounded-xl bg-muted/60 backdrop-blur-sm [&_svg:not([class*='size-'])]:size-5" />

            <main className="w-full">
              <div className="w-full min-h-full flex flex-col justify-center items-center mx-auto pb-9">
                <ClientOnly>{children}</ClientOnly>
              </div>
              <AppFooter />

            </main>

          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
