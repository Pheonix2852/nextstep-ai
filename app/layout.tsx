import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {  ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/ui/header"
import { dark } from '@clerk/themes'
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextStep AI",
  description: "Next-Gen Coaching for the Next-Gen Workforce",
  icons: {
    icon: '/Icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
        baseTheme: dark,
      }}>
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>

            {/* header */}
            <Header />
            <main className="min-h-screen">
              {children}
            </main>

            <Toaster richColors></Toaster>

            {/* footer */}
            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Sagnik</p>
              </div>
            </footer>
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
