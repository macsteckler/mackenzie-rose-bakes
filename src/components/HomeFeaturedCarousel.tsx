"use client";

import Image from "next/image";
import { useState } from "react";
import { portfolioImageAlt } from "@/lib/site";

interface Photo {
  url: string;
  name: string;
}

export default function HomeFeaturedCarousel({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(photos.length - 3, i + 1));
  const canPrev = index > 0;
  const canNext = index + 3 < photos.length;

  if (photos.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="aspect-[4/5] rounded-2xl flex flex-col items-center justify-center"
            style={{ backgroundColor: "#fce4ec" }}
          >
            <span className="text-3xl mb-1">🎂</span>
            <span className="text-rose-300 text-xs font-medium">Coming soon</span>
          </div>
        ))}
      </div>
    );
  }

  const visible = photos.slice(index, index + 3);
  // Pad to always show 3 slots
  while (visible.length < 3) visible.push(visible[visible.length - 1]);

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-4">
        {visible.map((photo, i) => (
          <div
            key={`${photo.name}-${i}`}
            className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-md group"
          >
            <Image
              src={photo.url}
              alt={portfolioImageAlt(photo.name, index + i)}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Navigation row */}
      <div className="flex items-center justify-between mt-5">
        <button
          onClick={prev}
          disabled={!canPrev}
          className="w-10 h-10 rounded-full border-2 border-rose-300 text-rose-500 flex items-center justify-center transition-all duration-200 disabled:opacity-30 hover:bg-rose-100 hover:border-rose-400"
          aria-label="Previous photos"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(Math.min(i, photos.length - 3))}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? "20px" : "7px",
                height: "7px",
                backgroundColor: i >= index && i < index + 3 ? "#f43f5e" : "#fda4af",
              }}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={!canNext}
          className="w-10 h-10 rounded-full border-2 border-rose-300 text-rose-500 flex items-center justify-center transition-all duration-200 disabled:opacity-30 hover:bg-rose-100 hover:border-rose-400"
          aria-label="Next photos"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
