import type { MetadataRoute } from "next";
import { SERVICE_PAGES, SITE_URL } from "@/lib/site";
import { getPublishedPortfolioPhotos } from "@/lib/supabase/public";
import { BLOG_POSTS } from "@/lib/blog";

// Re-check for newly published portfolio photos hourly.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const photoUrls = (await getPublishedPortfolioPhotos()).map((p) => p.url);

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: photoUrls.slice(0, 12),
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      images: photoUrls,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...SERVICE_PAGES.map((page) => ({
      url: `${SITE_URL}${page.href}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    // Blog posts aren't linked in the nav — the sitemap is how search engines find them.
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.published),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/order`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
