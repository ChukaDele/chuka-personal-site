import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{
    url: "https://chuka-personal-site.thebredge.workers.dev",
    lastModified: new Date("2026-08-10"),
    changeFrequency: "monthly",
    priority: 1,
  }];
}
