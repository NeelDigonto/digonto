import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { PigmentOptions, withPigment } from "@pigment-css/nextjs-plugin";
// import { ClassNameSlugVars } from "@wyw-in-js/shared";

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    rehypePlugins: [],
  },
});

const pigmentConfig: PigmentOptions = {
  classNameSlug: (
    hash: string,
    title: string /* args: ClassNameSlugVars */
  ) => {
    // console.log("hash", hash, "title", title, "args", args);
    return `${title}-${hash}`;
  },
};

// Merge MDX config with Next.js config
export default withMDX(withPigment(nextConfig, pigmentConfig));
