"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface Photo {
  url: string;
  name: string;
}

export default function PortfolioSlideshow({ photos }: { photos: Photo[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Auto-advance every 4 seconds unless user is interacting
  useEffect(() => {
    if (paused || photos.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, paused, photos.length]);

  if (photos.length === 0) {
    return (
      <div className="h-[85vh] flex items-center justify-center bg-rose-50">
        <div className="text-center">
          <div className="text-7xl mb-4">🎂</div>
          <h3
            className="text-2xl font-bold text-rose-900 mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Gallery Coming Soon
          </h3>
          <p className="text-stone-500 max-w-sm mx-auto">
            We&apos;re loading up our gallery. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-[85vh] overflow-hidden bg-rose-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Photo layers */}
      {photos.map((photo, i) => (
        <div
          key={photo.name}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
          aria-hidden={i !== activeIndex}
        >
          <Image
            src={photo.url}
            alt="Custom creation by Mackenzie Rose Bakes"
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      {/* Top counter */}
      <div className="absolute top-5 right-6 text-white/80 text-sm font-mono tabular-nums tracking-wider">
        {String(activeIndex + 1).padStart(2, "0")} /{" "}
        {String(photos.length).padStart(2, "0")}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label="Previous photo"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label="Next photo"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Bottom: dots + CTA */}
      <div className="absolute bottom-7 left-0 right-0 flex flex-col items-center gap-4">
        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === activeIndex ? "28px" : "8px",
                height: "8px",
                backgroundColor:
                  i === activeIndex
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.45)",
              }}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>

        {/* Order CTA */}
        <Link
          href="/order"
          className="px-6 py-2.5 bg-white/20 hover:bg-white/35 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30 transition-all duration-200 hover:-translate-y-0.5"
        >
          Love what you see? Order yours →
        </Link>
      </div>
    </div>
  );
}
