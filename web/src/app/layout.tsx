import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/reset.css";
import "@/styles/globals.css";
import "@/styles/container.css";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <body className={inter.variable}>
        <canvas className="bg-canvas" id="canvas" />
        <Header />
        {children}
      </body>
    </html>
  );
}

/**
 * <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
 * <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
 * <link rel="shortcut icon" href="/favicon.ico" />
 * <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
 * <meta name="apple-mobile-web-app-title" content="Digonto" />
 * <link rel="manifest" href="/site.webmanifest" />
 * #fadb92
 */
