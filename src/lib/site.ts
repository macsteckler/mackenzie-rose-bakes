import type { Metadata } from "next";

/** Public production site URL (canonical, sitemap, JSON-LD). */
export const SITE_URL = "https://mackenzierosebakes.com" as const;

export const SITE_NAME = "Mackenzie Rose Bakes" as const;

/** Google Analytics 4 measurement ID (public — it's visible in the page source anyway). */
export const GA_MEASUREMENT_ID = "G-3K0KKBQF6M" as const;

/** Social profiles — rendered in the header/footer and used as JSON-LD `sameAs`. */
export const SOCIAL_LINKS = [
  {
    platform: "instagram",
    label: "Instagram",
    handle: "@mackenzierosebakes",
    url: "https://www.instagram.com/mackenzierosebakes",
  },
  {
    platform: "tiktok",
    label: "TikTok",
    handle: "@mackenzierosebakes",
    url: "https://www.tiktok.com/@mackenzierosebakes",
  },
] as const;

export type SocialPlatform = (typeof SOCIAL_LINKS)[number]["platform"];

/** Where we bake and where we deliver — keep copy, JSON-LD, and FAQs consistent. */
export const BASE_NEIGHBORHOODS = "Midtown East & the Upper East Side" as const;
export const DELIVERY_BOROUGHS = [
  "Manhattan",
  "Brooklyn",
  "Queens",
  "The Bronx",
  "Staten Island",
] as const;

/** Dedicated service landing pages — linked from the nav, footer, and services page. */
export const SERVICE_PAGES = [
  { href: "/custom-cakes", label: "Custom Cakes" },
  { href: "/wedding-cakes", label: "Wedding Cakes" },
  { href: "/corporate-cakes", label: "Corporate & Office Cakes" },
] as const;

export function sitePath(path: string = "/"): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Full per-page metadata. Next.js replaces (does not merge) nested objects
 * like `openGraph` and `twitter` from the root layout, so every page needs
 * the complete set or it loses siteName/locale/url in link previews.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  /** Skip the "%s | Mackenzie Rose Bakes" template (for titles that already include the brand). */
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const url = sitePath(path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

const ALT_SUFFIX = "custom cake and baked creation by Mackenzie Rose Bakes, New York City";

/**
 * Fallback alt text when the admin hasn't written one. Storage paths look like
 * `1712345678-abc123-IMG_1234.jpg`, so strip the upload prefix and ignore
 * camera-generated names that carry no meaning.
 */
export function portfolioImageAlt(fileName: string, index: number): string {
  const words = fileName
    .replace(/\.[^.]+$/i, "")
    .replace(/^\d+-[a-z0-9]+-/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const isCameraName =
    /^(img|dsc|dscn|pxl|photo|image|screenshot|whatsapp image)\b/i.test(words) ||
    /^[\d\s]+$/.test(words);
  if (!words || isCameraName) {
    return `Portfolio photo ${index + 1} — ${ALT_SUFFIX}`;
  }
  const subject = words.replace(/\b\w/g, (c) => c.toUpperCase());
  return `${subject} — ${ALT_SUFFIX}`;
}

/** Alt text for a portfolio photo: admin alt text, then description, then filename fallback. */
export function portfolioPhotoAlt(
  photo: { name: string; altText: string | null; caption: string | null },
  index: number
): string {
  return (
    photo.altText?.trim() ||
    photo.caption?.trim() ||
    portfolioImageAlt(photo.name, index)
  );
}

/** Visible hover description: only human-written text, never the filename fallback. */
export function portfolioPhotoDescription(photo: {
  altText: string | null;
  caption: string | null;
}): string | null {
  return photo.caption?.trim() || photo.altText?.trim() || null;
}
