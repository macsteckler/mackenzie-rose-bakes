"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { portfolioImageAlt } from "@/lib/site";
import type { PortfolioPhoto } from "@/lib/supabase/public";

type PortfolioGridProps = {
  photos: PortfolioPhoto[];
};

export default function PortfolioGrid({ photos }: PortfolioGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selected =
    selectedIndex !== null ? photos[selectedIndex] ?? null : null;

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) =>
      current === null ? null : Math.max(0, current - 1)
    );
  }, []);

  const showNext = useCallback(() => {
    setSelectedIndex((current) =>
      current === null ? null : Math.min(photos.length - 1, current + 1)
    );
  }, [photos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrevious();
      if (e.key === "ArrowRight") showNext();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex, closeLightbox, showPrevious, showNext]);

  if (photos.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-7xl mb-4">🎂</div>
        <h3
          className="text-2xl font-bold text-rose-900 mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Gallery Coming Soon
        </h3>
        <p className="text-stone-500 max-w-sm mx-auto">
          We&apos;re loading up our gallery with beautiful creations. Check back
          soon — or follow along on Instagram!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Instagram-style square grid */}
      <div className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2">
        {photos.map((photo, index) => (
          <button
            key={photo.name}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-square overflow-hidden bg-stone-100 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
            aria-label={`View photo ${index + 1} of ${photos.length}`}
          >
            <Image
              src={photo.url}
              alt={
                photo.altText ?? portfolioImageAlt(photo.name, index)
              }
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <div className="flex items-center justify-between px-4 py-3 text-white/80 text-sm shrink-0">
            <span>
              {selectedIndex + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={closeLightbox}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-light transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 pb-4 min-h-0 relative">
            {selectedIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevious();
                }}
                className="absolute left-2 md:left-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                aria-label="Previous photo"
              >
                ‹
              </button>
            )}

            <div
              className="relative w-full max-w-3xl max-h-full aspect-square md:aspect-auto md:max-h-[min(80vh,900px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selected.url}
                alt={
                  selected.altText ??
                  portfolioImageAlt(selected.name, selectedIndex)
                }
                width={1200}
                height={1200}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            {selectedIndex < photos.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-2 md:right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                aria-label="Next photo"
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
