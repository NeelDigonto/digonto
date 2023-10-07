import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  title: "Saikat's garden",
  description: "Saikat's garden",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <link rel="icon" href="favicon.svg" />
      <link rel="mask-icon" href="favicon.svg" color="#000000" />
      <link rel="apple-touch-icon" href="favicon.svg"></link>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
