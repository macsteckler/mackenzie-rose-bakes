import type { Metadata } from "next";
import { getPortfolioPhotos } from "@/lib/supabase";
import PortfolioSlideshow from "@/components/PortfolioSlideshow";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Portfolio — Custom Cakes & Baked Goods NYC",
  description:
    "Browse our gallery of custom cakes, cupcakes, cookies, and celebration treats handcrafted in New York City. Every creation is designed just for you.",
  openGraph: {
    title: "Portfolio | Mackenzie Rose Bakes",
    description:
      "Browse our gallery of custom cakes and baked goods made in NYC.",
  },
};

export default async function PortfolioPage() {
  const photos = await getPortfolioPhotos();

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-2">
            Gallery
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-rose-950 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Our{" "}
            <span className="text-rose-500 italic">Creations</span>
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Scroll through our portfolio of custom designs — each one made from
            scratch, with love, right here in NYC.
          </p>
          {photos.length > 0 && (
            <p className="text-rose-400 text-sm mt-4">
              {photos.length} creation{photos.length !== 1 ? "s" : ""} and
              counting
            </p>
          )}
        </div>
      </section>

      {/* Scroll-driven slideshow — no wrapper padding, it fills the viewport */}
      <PortfolioSlideshow photos={photos} />

      {/* Upload hint when empty */}
      {photos.length === 0 && (
        <section className="py-8 bg-amber-50 border-y border-amber-100">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-amber-700 text-sm">
              <strong>To add photos:</strong> Upload images to your Supabase
              Storage &rarr;{" "}
              <code className="bg-amber-100 px-1.5 py-0.5 rounded">
                portfolio
              </code>{" "}
              bucket. They&apos;ll appear here automatically.
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Love What You See?
          </h2>
          <p className="text-rose-100 mb-7">
            Let&apos;s create something beautiful for your occasion.
          </p>
          <Link
            href="/order"
            className="inline-block px-8 py-3.5 bg-white text-rose-600 font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Request a Custom Order
          </Link>
        </div>
      </section>
    </>
  );
}
