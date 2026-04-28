import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolioPhotos } from "@/lib/supabase";
import { getGoogleReviews } from "@/lib/google-reviews";
import Sprinkles from "@/components/Sprinkles";
import HomeFeaturedCarousel from "@/components/HomeFeaturedCarousel";
import { SITE_URL, sitePath } from "@/lib/site";

const homeTitle = "Mackenzie Rose Bakes | Custom Cakes & Sweets NYC";
const homeDescription =
  "New York City's sweetest home baker. Handcrafted birthday cakes, wedding cakes, cupcakes, and celebration treats made with love in NYC. Order yours today.";

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: sitePath(),
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: SITE_URL,
  },
  twitter: {
    title: homeTitle,
    description: homeDescription,
  },
};

// Inline wave at the bottom of a section — fill = next section's bg color
// Both paths start AND end at y=0 so there's no rectangular bg strip at the edges
function BottomWave({ fill, bg, flip = false }: { fill: string; bg: string; flip?: boolean }) {
  const path = flip
    ? "M0,0 C480,0 960,96 1440,0 L1440,96 L0,96 Z"
    : "M0,0 C480,96 960,96 1440,0 L1440,96 L0,96 Z";
  return (
    <div style={{ backgroundColor: bg, lineHeight: 0, fontSize: 0, display: "block", marginBottom: "-3px" }}>
      <svg viewBox="0 0 1440 96" xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "80px" }}
        aria-hidden="true">
        <path d={path} fill={fill} />
      </svg>
    </div>
  );
}

const services = [
  { icon: "🎂", title: "Birthday Cakes", desc: "Bold, personalized creations for every age and style.", bg: "bg-rose-100", border: "border-rose-200" },
  { icon: "💒", title: "Wedding Cakes", desc: "Elegant tiered masterpieces for your perfect day.", bg: "bg-pink-100", border: "border-pink-200" },
  { icon: "🧁", title: "Cupcakes", desc: "Individual flavors and designs, perfect for any event.", bg: "bg-amber-100", border: "border-amber-200" },
  { icon: "🍪", title: "Custom Cookie Assortment", desc: "Thoughtfully curated custom cookie assortments for any occasion.", bg: "bg-yellow-100", border: "border-yellow-200" },
  { icon: "✨", title: "Your Vision, Made Real", desc: "Got a wild idea? Describe your dream and we'll bring it to life.", bg: "bg-purple-100", border: "border-purple-200" },
];

const staticReviews = [
  { name: "Emily R.", subtitle: "Upper West Side, NYC", text: "Mackenzie made the most stunning birthday cake I've ever seen — and it tasted even better than it looked. Everyone at the party was asking for her info!", stars: 5, accent: "bg-rose-400" },
  { name: "Jessica & Tom", subtitle: "Brooklyn, NYC", text: "Our wedding cake was an absolute dream. Mackenzie listened to every detail and brought our vision to life perfectly. We couldn't have asked for more.", stars: 5, accent: "bg-amber-400" },
  { name: "Sarah M.", subtitle: "Midtown Manhattan", text: "I've ordered cupcakes for our office twice now. Every single time they're beautiful, delicious, and delivered on time. Absolutely love her work!", stars: 5, accent: "bg-pink-400" },
];

// Accent colors cycled across Google reviews (no accent data in Places API response)
const accentCycle = ["bg-rose-400", "bg-amber-400", "bg-pink-400", "bg-purple-400", "bg-sky-400"];

function buildBakeryJsonLd(googleReviews: Awaited<ReturnType<typeof getGoogleReviews>>) {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const sameAsList =
    placeId && placeId.length > 0
      ? [`https://www.google.com/maps/place/?q=place_id:${placeId}`]
      : null;

  const businessPhone = process.env.BUSINESS_PHONE;
  const showAggregate =
    googleReviews && googleReviews.total > 0;

  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: "Mackenzie Rose Bakes",
    description:
      "Custom cakes, cupcakes, and baked goods handcrafted in New York City.",
    image: `${SITE_URL}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
    },
    url: SITE_URL,
    servesCuisine: "Bakery",
    priceRange: "$$",
    areaServed: { "@type": "City", name: "New York City" },
    openingHours: "By appointment. Contact for custom order lead times, pickup, and delivery.",
    ...(businessPhone ? { telephone: businessPhone } : {}),
    ...(showAggregate
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: googleReviews.rating,
            reviewCount: googleReviews.total,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(sameAsList ? { sameAs: sameAsList } : {}),
  };
}

export default async function HomePage() {
  const [photos, googleReviews] = await Promise.all([
    getPortfolioPhotos(),
    getGoogleReviews(),
  ]);

  const placeId = process.env.GOOGLE_PLACE_ID;
  const writeReviewUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : null;

  const jsonLd = buildBakeryJsonLd(googleReviews);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ── */}
      <section className="relative" style={{ backgroundColor: "#fce4ec" }}>
        {/* Sprinkles layer — clipped to section, doesn't affect wave */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sprinkles />
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 50%, transparent 100%)" }} />
        </div>
        {/* Content */}
        <div className="relative min-h-[90vh] flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 shadow-sm border border-rose-200">
                <span className="text-sm">🎂</span>
                <span className="text-rose-600 text-sm font-medium">New York City&apos;s Custom Home Baker</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-rose-950 leading-tight mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}>
                Baked with Love,{" "}
                <span className="text-rose-500 italic">Made for You</span>
              </h1>
              <p className="text-lg text-rose-900/70 leading-relaxed mb-8 max-w-xl">
                Custom cakes, cupcakes & treats handcrafted in New York City.
                Every creation is designed to make your moment unforgettable.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/portfolio"
                  className="px-7 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  View Our Work
                </Link>
                <Link href="/order"
                  className="px-7 py-3.5 bg-white hover:bg-rose-50 text-rose-600 font-semibold rounded-full border-2 border-rose-300 hover:border-rose-400 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                  Order a Cake
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-rose-900/60">
                <span className="flex items-center gap-1.5"><span className="text-amber-500">★★★★★</span> 5-star rated</span>
                <span className="flex items-center gap-1.5">🗽 NYC-based</span>
                <span className="flex items-center gap-1.5">🎨 100% custom</span>
              </div>
            </div>
          </div>
        </div>
        {/* Wave — outside sprinkles layer, never clipped */}
        <BottomWave bg="#fce4ec" fill="white" />
      </section>

      {/* ── FEATURED PORTFOLIO ── */}
      <section className="bg-white">
        <div className="py-10 md:py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-pink-500 text-xs font-bold tracking-[0.25em] uppercase mb-2">🎀 Portfolio</p>
            <h2 className="text-3xl md:text-4xl font-bold text-rose-950" style={{ fontFamily: "var(--font-playfair)" }}>
              A Taste of Our <span className="text-rose-500 italic">Creations</span>
            </h2>
          </div>
          <HomeFeaturedCarousel photos={photos} />
          <div className="text-center mt-8">
            <Link href="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 font-semibold rounded-full border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-100 transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
              View Full Gallery →
            </Link>
          </div>
        </div>
        {/* Wave into Services (#fce4ec) — flipped */}
        <BottomWave bg="white" fill="#fce4ec" flip />
      </section>

      {/* ── SERVICES ── */}
      <section className="relative" style={{ backgroundColor: "#fce4ec" }}>
        {/* Sprinkles layer — clipped to section, doesn't affect wave */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sprinkles />
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 60%, transparent 100%)" }} />
        </div>
        {/* Content */}
        <div className="relative py-10 md:py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-pink-500 text-xs font-bold tracking-[0.25em] uppercase mb-2">🍰 Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-rose-950" style={{ fontFamily: "var(--font-playfair)" }}>
              What We Create
            </h2>
            <p className="text-rose-900/60 mt-3 max-w-md mx-auto text-sm">
              From intimate birthday cakes to grand wedding centerpieces — every occasion deserves something beautiful.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((service) => (
              <div key={service.title}
                className={`${service.bg} border ${service.border} rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
                <div className="text-3xl mb-2">{service.icon}</div>
                <h3 className="text-sm font-bold text-rose-900 mb-1.5" style={{ fontFamily: "var(--font-playfair)" }}>{service.title}</h3>
                <p className="text-rose-900/60 text-xs leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm">
              See All Services & Pricing →
            </Link>
          </div>
        </div>
        {/* Wave — outside sprinkles layer, never clipped */}
        <BottomWave bg="#fce4ec" fill="white" />
      </section>

      {/* ── OUR STORY ── */}
      <section className="bg-white">
        <div className="py-10 md:py-14 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-pink-500 text-xs font-bold tracking-[0.25em] uppercase mb-3">🌸 Our Story</p>
          <h2 className="text-3xl md:text-4xl font-bold text-rose-950 mb-5 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
            Passion in Every <span className="text-rose-500 italic">Slice</span>
          </h2>
          <p className="text-stone-600 leading-relaxed mb-3 text-sm md:text-base">
            Hi, I&apos;m Mackenzie — a New York City-based cake artist with a love for bold colors, intricate designs, and ingredients that make your taste buds sing.
          </p>
          <p className="text-stone-600 leading-relaxed mb-7 text-sm md:text-base">
            Every cake is made from scratch with premium ingredients, crafted to your exact vision. Whether it&apos;s a whimsical birthday cake or an elegant wedding centerpiece, I pour my heart into every layer.
          </p>
          <Link href="/about"
            className="inline-flex items-center gap-2 text-rose-500 font-semibold hover:text-rose-600 transition-colors group text-sm">
            Read my full story
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        {/* Wave into Reviews section */}
        <BottomWave bg="white" fill="#fce4ec" flip />
      </section>

      {/* ── REVIEWS ── */}
      <section className="relative" style={{ backgroundColor: "#fce4ec" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sprinkles />
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 60%, transparent 100%)" }} />
        </div>
        <div className="relative py-10 md:py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-pink-500 text-xs font-bold tracking-[0.25em] uppercase mb-2">⭐ Reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold text-rose-950" style={{ fontFamily: "var(--font-playfair)" }}>
              What Our Customers <span className="text-rose-500 italic">Say</span>
            </h2>
            {googleReviews && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-amber-500 text-lg leading-none">★★★★★</span>
                <span className="text-rose-900/70 text-sm">
                  {googleReviews.rating.toFixed(1)} · {googleReviews.total} reviews on Google
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(googleReviews
              ? googleReviews.reviews.map((r, i) => ({
                  name: r.author_name,
                  subtitle: r.relative_time_description,
                  text: r.text,
                  stars: r.rating,
                  accent: accentCycle[i % accentCycle.length],
                }))
              : staticReviews
            ).map((review, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${review.accent} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-rose-950 text-sm truncate">{review.name}</p>
                    <p className="text-rose-900/50 text-xs truncate">{review.subtitle}</p>
                  </div>
                  {/* Google G badge — only shown for live Google reviews */}
                  {googleReviews && (
                    <div className="ml-auto flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" aria-label="Google review" role="img">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                  )}
                </div>
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className={s < review.stars ? "text-amber-400 text-sm" : "text-rose-200 text-sm"}>★</span>
                  ))}
                </div>
                {/* Review text */}
                <p className="text-stone-600 text-sm leading-relaxed">
                  {review.text.length > 200 ? `${review.text.slice(0, 197)}…` : review.text}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom actions */}
          {(googleReviews || writeReviewUrl) && (
            <div className="mt-10 flex flex-col items-center gap-4">
              {/* Leave a review CTA */}
              {writeReviewUrl && (
                <div className="bg-white rounded-2xl px-7 py-5 shadow-sm border border-rose-100 text-center max-w-sm w-full">
                  <p className="text-rose-950 font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                    Loved your order?
                  </p>
                  <p className="text-stone-500 text-xs mb-4">
                    A Google review means the world — it takes less than a minute!
                  </p>
                  <a
                    href={writeReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" opacity="0.9"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" opacity="0.9"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor" opacity="0.9"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" opacity="0.9"/>
                    </svg>
                    Leave a Review on Google
                  </a>
                </div>
              )}
              {/* See all reviews link */}
              {googleReviews && (
                <a
                  href={`https://www.google.com/maps/place/?q=place_id:${googleReviews.placeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-rose-50 text-rose-600 font-semibold rounded-full border-2 border-rose-200 hover:border-rose-400 transition-all duration-200 hover:-translate-y-0.5 shadow-sm text-sm">
                  See all reviews on Google →
                </a>
              )}
            </div>
          )}
        </div>
        <BottomWave bg="#fce4ec" fill="white" />
      </section>

      {/* ── CTA — white ── */}
      <section className="bg-white">
        <div className="py-14 md:py-20 max-w-xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-rose-950 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            Ready to Make It Sweet? 🎂
          </h2>
          <p className="text-stone-500 text-base mb-7 max-w-sm mx-auto">
            Custom orders fill up fast — especially around holidays and wedding season. Book yours today.
          </p>
          <Link href="/order"
            className="inline-block px-10 py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold text-base rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
            Request a Custom Order
          </Link>
          <p className="text-stone-400 text-xs mt-4">NYC &amp; surrounding areas · Made fresh to order</p>
        </div>
      </section>
    </>
  );
}
