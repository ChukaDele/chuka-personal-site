import type { MetadataRoute } from "next";
import { absoluteSiteUrl, siteIndexable } from "../lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!siteIndexable) return { rules: { userAgent: "*", disallow: "/" } };
  const sitemap = absoluteSiteUrl("/sitemap.xml");
  return { rules: { userAgent: "*", allow: "/" }, sitemap: sitemap ?? undefined };
}
