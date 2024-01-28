import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saikat's Blog",
  description: "Saikat's Blog",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <body>{children}</body>;
}
