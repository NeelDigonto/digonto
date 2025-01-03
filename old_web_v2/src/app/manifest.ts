import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Saikat's garden",
    short_name: "Saikat's garden",
    description: "Saikat's garden",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
