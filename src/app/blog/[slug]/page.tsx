import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";
import {
  SITE_NAME,
  SITE_URL,
  pageMetadata,
  portfolioPhotoAlt,
  portfolioPhotoDescription,
  sitePath,
} from "@/lib/site";
import { getPublishedPortfolioPhotos } from "@/lib/supabase/public";

export const revalidate = 60;
// Only the posts in BLOG_POSTS exist; anything else 404s.
export const dynamicParams = false;

const MAX_PHOTOS = 8;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return {};
  const base = pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    absoluteTitle: true,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      authors: ["Mackenzie"],
    },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();

  const photos = (await getPublishedPortfolioPhotos())
    .filter((p) => post.photoMatch.test(`${p.altText ?? ""} ${p.caption ?? ""}`))
    .slice(0, MAX_PHOTOS);
  const url = sitePath(`/blog/${post.slug}`);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url,
      mainEntityOfPage: url,
      datePublished: post.published,
      dateModified: post.updated ?? post.published,
      author: { "@type": "Person", name: "Mackenzie", url: sitePath("/about") },
      publisher: { "@id": `${SITE_URL}/#bakery`, name: SITE_NAME },
      image: photos.length > 0 ? photos.map((p) => p.url) : `${SITE_URL}/opengraph-image`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Header */}
        <header className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 py-14 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-3">
              From the Kitchen
            </p>
            <h1
              className="text-4xl md:text-5xl font-bold text-rose-950 leading-tight mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {post.title}
            </h1>
            <p className="text-stone-500 text-sm">
              By <Link href="/about" className="text-rose-600 hover:underline">Mackenzie</Link>
              {" · "}
              <time dateTime={post.published}>{formatDate(post.published)}</time>
            </p>
          </div>
        </header>

        <div className="bg-white py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-stone-700 leading-relaxed">
            <div className="space-y-5 text-lg">
              {post.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {post.sections.map((section) => (
              <section key={section.heading} className="mt-12">
                <h2
                  className="text-2xl md:text-3xl font-bold text-rose-950 mb-4"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.paragraphs?.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {section.list && (
                    <ul className="space-y-2 pl-1">
                      {section.list.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="text-rose-400 font-bold flex-shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Photos with visible captions */}
        {photos.length > 0 && (
          <section className="bg-gradient-to-b from-rose-50 to-amber-50 py-12 md:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2
                className="text-2xl md:text-3xl font-bold text-rose-950 text-center mb-8"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Recent Cakes for Inspiration
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((photo, i) => (
                  <figure key={photo.name}>
                    <div className="aspect-square relative rounded-2xl overflow-hidden shadow-md bg-stone-100">
                      <Image
                        src={photo.url}
                        alt={portfolioPhotoAlt(photo, i)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <figcaption className="mt-2 text-xs text-stone-500 leading-snug line-clamp-3">
                      {portfolioPhotoDescription(photo)}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQs */}
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl md:text-3xl font-bold text-rose-950 mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {post.faqs.map((faq) => (
                <div key={faq.q} className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                  <h3
                    className="font-bold text-rose-900 mb-2"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {faq.q}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-white text-center border-t border-rose-50">
          <div className="max-w-xl mx-auto px-4">
            <h2
              className="text-3xl font-bold mb-3 text-rose-950"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Ready to Plan Your Cake?
            </h2>
            <p className="text-stone-500 mb-7">
              Tell us about your celebration — we&apos;ll reply within 24 hours.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={post.cta.href}
                className="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {post.cta.label}
              </Link>
              <Link
                href="/custom-cakes"
                className="px-8 py-3.5 bg-white text-rose-600 font-semibold rounded-full border-2 border-rose-200 hover:border-rose-400 transition-all duration-200"
              >
                Explore Custom Cakes
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
