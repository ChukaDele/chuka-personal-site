import type { MetadataRoute } from "next";
import { absoluteSiteUrl, siteIndexable } from "../lib/seo";

const canonicalPaths = ["/", "/work", "/work/etap", "/work/rvysion", "/work/the-bredge", "/about", "/speaking", "/library", "/notes", "/resume", "/press"];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteIndexable) return [];
  return canonicalPaths.map((path) => ({ url: absoluteSiteUrl(path)!, changeFrequency: path === "/" ? "monthly" : "yearly", priority: path === "/" ? 1 : .7 }));
}
