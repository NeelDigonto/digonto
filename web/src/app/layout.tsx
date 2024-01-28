import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/reset.css";
import "@/styles/globals.css";
import "@/styles/note.css";
import "@/styles/roadmap.css";
import "@/styles/badge.css";
import "@/styles/header.css";
import "@/styles/hero.css";
import "@/styles/blog.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  title: "Saikat's garden",
  description: "Saikat's garden",
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      {children}
    </html>
  );
}
