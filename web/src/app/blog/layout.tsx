import React from "react";
import type { Metadata } from "next";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Saikat's Blog",
  description: "Saikat's Blog",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className={styles.blog_main}>{children}</main>;
}
