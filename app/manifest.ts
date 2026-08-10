import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chuka Dele-Oyeleru | Strategy & Operations",
    short_name: "Chuka Dele-Oyeleru",
    description: "Work, practice, speaking and notes from Chuka Dele-Oyeleru.",
    start_url: "/",
    display: "standalone",
    background_color: "#eee9df",
    theme_color: "#102832",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
