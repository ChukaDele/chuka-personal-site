import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://chuka-personal-site.thebredge.workers.dev/sitemap.xml",
  };
}
