import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/header/Header";

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-crimson",
  preload: true,
});

export const metadata: Metadata = {
  title: "Saikat's garden",
  description: "Saikat's garden",
  icons: [
    {
      rel: "icon",
      type: "image/svg+xml",
      url: "/favicon.svg",
    },
    {
      rel: "shortcut icon",
      url: "/favicon.ico",
    },
    /* {
      rel: "icon",
      type: "image/png",
      url: "/favicon-96x96.png",
      sizes: "96x96",
    },
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
      sizes: "180x180",
    }, */
  ],

  appleWebApp: {
    title: "Digonto",
  },
  manifest: "./manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const conditionalGA =
    process.env.NODE_ENV === "production" ? (
      <GoogleAnalytics gaId="G-D43WEFWZBE" />
    ) : null;

  return (
    <html lang="en">
      {/* <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> */}

      <body className={crimsonText.variable}>
        <Header />
        <div className="h-[var(--header-height)]" />
        {children}
      </body>
      {conditionalGA}
    </html>
  );
}
