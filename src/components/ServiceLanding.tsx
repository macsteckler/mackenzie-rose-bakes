import Image from "next/image";
import Link from "next/link";
import {
  BASE_NEIGHBORHOODS,
  DELIVERY_BOROUGHS,
  SITE_URL,
  portfolioPhotoAlt,
  portfolioPhotoDescription,
  sitePath,
} from "@/lib/site";
import type { PortfolioPhoto } from "@/lib/supabase/public";

export type ServiceLandingContent = {
  path: string;
  /** Short name used in breadcrumbs and structured data. */
  name: string;
  eyebrow: string;
  heading: string;
  headingAccent: string;
  intro: string;
  startingPrice: string;
  /** Pre-selects this option in OrderForm's service select (must match exactly). */
  orderService?: string;
  orderCta: string;
  sections: { heading: string; paragraphs: string[] }[];
  highlights: { icon: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  /** Photos whose description matches are shown first in the gallery. */
  photoMatch: RegExp;
  galleryHeading: string;
};

const GALLERY_SIZE = 6;

function pickPhotos(photos: PortfolioPhoto[], match: RegExp): PortfolioPhoto[] {
  const text = (p: PortfolioPhoto) => `${p.altText ?? ""} ${p.caption ?? ""}`;
  const matching = photos.filter((p) => match.test(text(p)));
  const rest = photos.filter((p) => !match.test(text(p)));
  return [...matching, ...rest].slice(0, GALLERY_SIZE);
}

function buildJsonLd(content: ServiceLandingContent) {
  const url = sitePath(content.path);
  const minPrice = content.startingPrice.match(/\$(\d+)/)?.[1];
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: content.name,
      description: content.intro,
      url,
      provider: { "@id": `${SITE_URL}/#bakery` },
      areaServed: DELIVERY_BOROUGHS.map((name) => ({
        "@type": "AdministrativeArea",
        name: `${name}, New York City`,
      })),
      ...(minPrice
        ? {
            offers: {
              "@type": "Offer",
              priceSpecification: {
                "@type": "PriceSpecification",
                minPrice: Number(minPrice),
                priceCurrency: "USD",
              },
            },
          }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Services", item: sitePath("/services") },
        { "@type": "ListItem", position: 3, name: content.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];
}

export default function ServiceLanding({
  content,
  photos,
}: {
  content: ServiceLandingContent;
  photos: PortfolioPhoto[];
}) {
  const gallery = pickPhotos(photos, content.photoMatch);
  const orderHref = content.orderService
    ? `/order?service=${encodeURIComponent(content.orderService)}`
    : "/order";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(content)) }}
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="Breadcrumb" className="text-xs text-stone-400 mb-4">
            <Link href="/" className="hover:text-rose-500">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/services" className="hover:text-rose-500">Services</Link>
            <span className="mx-1.5">/</span>
            <span className="text-stone-500">{content.name}</span>
          </nav>
          <p className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-2">
            {content.eyebrow}
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-rose-950 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {content.heading}{" "}
            <span className="text-rose-500 italic">{content.headingAccent}</span>
          </h1>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto">{content.intro}</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
            <Link
              href={orderHref}
              className="px-7 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              {content.orderCta}
            </Link>
            <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-white/80 text-rose-700 border border-rose-100">
              From {content.startingPrice}
            </span>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {content.highlights.map((item) => (
              <div
                key={item.title}
                className="bg-rose-50 rounded-2xl p-6 text-center border border-rose-100"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h2
                  className="font-bold text-rose-900 mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {item.title}
                </h2>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Long-form content */}
      <section className="pb-14 md:pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2
                className="text-2xl md:text-3xl font-bold text-rose-950 mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {section.heading}
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-14 md:py-20 bg-gradient-to-b from-rose-50 to-amber-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-3xl md:text-4xl font-bold text-rose-950 text-center mb-10"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {content.galleryHeading}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {gallery.map((photo, i) => {
                const description = portfolioPhotoDescription(photo);
                return (
                  <figure
                    key={photo.name}
                    className="aspect-square relative rounded-2xl overflow-hidden shadow-md group bg-stone-100"
                  >
                    <Image
                      src={photo.url}
                      alt={portfolioPhotoAlt(photo, i)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    {description && (
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-rose-950/85 via-rose-950/50 to-transparent px-3 pt-10 pb-3 text-white text-xs sm:text-sm leading-snug line-clamp-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {description}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-600 font-semibold rounded-full border-2 border-rose-200 hover:border-rose-400 transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
              >
                See the Full Portfolio →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-4xl font-bold text-rose-950 text-center mb-10"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {content.faqs.map((faq) => (
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
      <section className="py-16 bg-white text-center border-t border-rose-50">
        <div className="max-w-xl mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3 text-rose-950"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Let&apos;s Plan Your Order
          </h2>
          <p className="text-stone-500 mb-7">
            Based in {BASE_NEIGHBORHOODS} and delivering anywhere in New York
            City — {DELIVERY_BOROUGHS.join(", ")}.
          </p>
          <Link
            href={orderHref}
            className="inline-block px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            {content.orderCta}
          </Link>
        </div>
      </section>
    </>
  );
}
