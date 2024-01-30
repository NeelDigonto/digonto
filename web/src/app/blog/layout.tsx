import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saikat's garden",
  description: "Saikat's garden",
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
};


export default function BlogLayout({
  children,
  ...other
}: {
  children: React.ReactNode;
}) {
  console.log(meta)
  return <body>{children}</body>;
}
