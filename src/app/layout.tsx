import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Customer Support Dashboard",
  description: "AI-assisted support dashboard MVP"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
