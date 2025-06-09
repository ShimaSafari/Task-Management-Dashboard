import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TodoProvider } from "@/lib/TodoContext";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Task Management Dashboard",
  description: "Manage your tasks efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TodoProvider>
            <Header />
            <div className="min-h-screen bg-background">
              {/* Main Content */}
              <main className="flex-1">{children}</main>
            </div>
            <Toaster richColors />
          </TodoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
