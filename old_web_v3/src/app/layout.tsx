import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@pigment-css/react/styles.css";
// import "@/styles/reset.css";
// import "@/styles/globals.css";
import Header from "@/components/Header/Header";
import { GoogleAnalytics } from "@next/third-parties/google";
import { globalCss } from "@pigment-css/react";

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalCss`
/*
  1. Use a more-intuitive box-sizing model.
*/
*,
*::before,
*::after {
  box-sizing: border-box;
}
/*
  2. Remove default margin
*/
* {
  padding: 0; /* maybe not required */
  margin: 0;
}
/*
  Typographic tweaks!
  3. Add accessible line-height
  4. Improve text rendering
*/
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
/*
  5. Improve media defaults
*/
img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}
/*
  6. Remove built-in form typography styles
*/
input,
button,
textarea,
select {
  font: inherit;
}
/*
  7. Avoid text overflows
*/
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}
/*
  8. Create a root stacking context
*/
#root,
#__next {
  isolation: isolate;
}

html,
body {
  max-width: 100vw;
  /* overflow-x: hidden; */
}

a {
  color: inherit;
  text-decoration: none;
}

button, input[type="submit"], input[type="reset"] {
	background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	outline: inherit;
}
`;

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalCss`
:root {
  font-family: var(--font-inter), sans-serif;
  --header-height: 3.5rem;

  --background-color: #ffffff;
  --foreground-color: #171717;

  --bp-xxs: 320px; /* smartphones, iPhone, portrait 480x320 phones */
  --bp-xs: 480px; /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
  --bp-sm: 640px; /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
  --bp-md: 768px; /* tablet, landscape iPad, lo-res laptops ands desktops */
  --bp-lg: 1024px; /* big landscape tablets, laptops, and desktops */
  --bp-xl: 1280px; /* hi-res laptops and desktops */
  --bp-xxl: 1536px; /* big hi-res laptops and desktops */
}

@media (prefers-color-scheme: dark) or (prefers-color-scheme: light) {
  html {
    color-scheme: dark;
  }

  :root {
    --background-color: #0a0a0a;
    --foreground-color: #ededed;
  }
}

body {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  font-size: 1.1rem;
  letter-spacing: 0.3px;

  color: var(--foreground-color);
  background: var(--background-color);
}

/* scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 10px;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}

::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(255, 255, 255, 0.3);
}
`;

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
  const conditionalGA =
    process.env.NODE_ENV === "production" ? (
      <GoogleAnalytics gaId="G-D43WEFWZBE" />
    ) : null;

  return (
    <html lang="en">
      {/* <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> */}
      <body className={inter.variable}>
        <Header />
        {children}
      </body>
      {conditionalGA}
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
