import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/Toast";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zzelix - Play Your Dreams | Interactive Visual Novel Platform",
  description: "Stream interactive visual novels and visual novel games directly in your browser. No downloads required. Premium storytelling experiences await.",
  keywords: ["visual novel", "interactive fiction", "streaming games", "browser games", "story games"],
  authors: [{ name: "Zzelix" }],
  openGraph: {
    title: "Zzelix - Play Your Dreams",
    description: "Stream interactive visual novels directly in your browser",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-[var(--zz-bg-deep)] text-white min-h-screen`} suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>

        {/* Global UI Components */}
        <ToastContainer />
        <ScrollToTop />
      </body>
    </html>
  );
}
