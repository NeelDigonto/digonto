import { Metadata } from "next";

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
  return <body>{children}</body>;
}
