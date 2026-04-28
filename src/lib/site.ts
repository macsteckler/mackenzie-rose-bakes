/** Public production site URL (canonical, sitemap, JSON-LD). */
export const SITE_URL = "https://www.mackenzierosebakes.com" as const;

export function sitePath(path: string = "/"): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Build descriptive alt text from a storage file name (no DB caption available).
 * Strips the extension, replaces dashes/underscores with spaces, title-cases lightly.
 */
export function portfolioImageAlt(fileName: string, index: number): string {
  const withoutExt = fileName.replace(/\.[^.]+$/i, "");
  const words = withoutExt
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const subject =
    words.length > 0
      ? words.replace(/\b\w/g, (c) => c.toUpperCase())
      : `Portfolio photo ${index + 1}`;
  return `${subject} — custom cake and baked creation by Mackenzie Rose Bakes, New York City`;
}
