import type { Metadata } from "next";

const configuredUrl = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;

function readSiteUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

export const siteUrl = readSiteUrl(configuredUrl);
export const siteIndexable = Boolean(siteUrl && process.env.ALLOW_INDEXING === "true");

export function absoluteSiteUrl(path = "/") {
  return siteUrl ? new URL(path, siteUrl).toString() : null;
}

export function createPageMetadata({ title, description, path, image = "/og-image.png", imageAlt, absoluteTitle = false }: { title: string; description: string; path: string; image?: string; imageAlt?: string; absoluteTitle?: boolean }): Metadata {
  const canonical = absoluteSiteUrl(path);
  const socialImage = absoluteSiteUrl(image);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: { index: siteIndexable, follow: true, googleBot: { index: siteIndexable, follow: true } },
    openGraph: { type: "website", title, description, url: canonical ?? undefined, siteName: "Chuka Dele-Oyeleru", images: socialImage ? [{ url: socialImage, width: 1200, height: 630, alt: imageAlt ?? title }] : undefined },
    twitter: { card: "summary_large_image", title, description, images: socialImage ? [socialImage] : undefined },
  };
}
