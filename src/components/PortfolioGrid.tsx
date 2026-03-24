"use client";

import Image from "next/image";
import { useState } from "react";

interface Photo {
  url: string;
  name: string;
}

interface PortfolioGridProps {
  photos: Photo[];
}

export default function PortfolioGrid({ photos }: PortfolioGridProps) {
  const [selected, setSelected] = useState<Photo | null>(null);

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
      {/* Masonry-style grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo, i) => (
          <div
            key={photo.name}
            className="break-inside-avoid relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => setSelected(photo)}
          >
            <div
              className="relative w-full"
              style={{ paddingBottom: i % 3 === 0 ? "130%" : i % 3 === 1 ? "100%" : "80%" }}
            >
              <Image
                src={photo.url}
                alt={`Custom cake by Mackenzie Rose Bakes`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-white text-xs font-medium">
                  View full size →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selected.url}
              alt="Custom cake by Mackenzie Rose Bakes"
              width={1200}
              height={900}
              className="w-full h-auto max-h-[80vh] object-contain bg-white"
            />
            <button
              className="absolute top-3 right-3 bg-white/90 hover:bg-white text-rose-950 rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold shadow-md transition-colors"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
