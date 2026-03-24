import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolioPhotos } from "@/lib/supabase";
import Sprinkles from "@/components/Sprinkles";
import HomeFeaturedCarousel from "@/components/HomeFeaturedCarousel";

export const metadata: Metadata = {
  title: "Mackenzie Rose Bakes | Custom Cakes & Sweets NYC",
  description:
    "New York City's sweetest custom cake studio. Handcrafted birthday cakes, wedding cakes, cupcakes, and celebration treats made with love in NYC. Order yours today.",
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
  { icon: "🍪", title: "Cookie Boxes", desc: "Decorated sugar cookies and custom cookie assortments.", bg: "bg-yellow-100", border: "border-yellow-200" },
  { icon: "✨", title: "Your Vision, Made Real", desc: "Got a wild idea? Describe your dream and we'll bring it to life.", bg: "bg-purple-100", border: "border-purple-200" },
];

const testimonials = [
  { name: "Emily R.", location: "Upper West Side, NYC", text: "Mackenzie made the most stunning birthday cake I've ever seen — and it tasted even better than it looked. Everyone at the party was asking for her info!", stars: 5, accent: "bg-rose-400" },
  { name: "Jessica & Tom", location: "Brooklyn, NYC", text: "Our wedding cake was an absolute dream. Mackenzie listened to every detail and brought our vision to life perfectly. We couldn't have asked for more.", stars: 5, accent: "bg-amber-400" },
  { name: "Sarah M.", location: "Midtown Manhattan", text: "I've ordered cupcakes for our office twice now. Every single time they're beautiful, delicious, and delivered on time. Absolutely love her work!", stars: 5, accent: "bg-pink-400" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Mackenzie Rose Bakes",
  description: "Custom cakes, cupcakes, and baked goods handcrafted in New York City.",
  address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
  url: "https://www.mackenzierosebakes.com",
  servesCuisine: "Bakery",
  priceRange: "$$",
  areaServed: { "@type": "City", name: "New York City" },
};

export default async function HomePage() {
  const photos = await getPortfolioPhotos();

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
                <span className="text-rose-600 text-sm font-medium">New York City&apos;s Custom Cake Studio</span>
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
