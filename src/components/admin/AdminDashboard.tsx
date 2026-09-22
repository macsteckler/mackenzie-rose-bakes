"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  uploadPortfolioPhotosAction,
  updatePortfolioPhotoDetailsAction,
  setPortfolioPhotoPublishedAction,
  reorderPortfolioPhotosAction,
  deletePortfolioPhotoAction,
  signOutAdminAction,
  type UploadActionResult,
} from "@/app/admin/actions";
import type { AdminPortfolioPhoto } from "@/lib/supabase/admin";

type Props = {
  adminEmail: string;
  initialPhotos: AdminPortfolioPhoto[];
};

export default function AdminDashboard({ adminEmail, initialPhotos }: Props) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initialPhotos);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadActionResult | null>(
    null
  );
  const [selectedCount, setSelectedCount] = useState(0);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);

  async function handleUpload(formData: FormData) {
    setIsUploading(true);
    setUploadResult(null);
    try {
      const result = await uploadPortfolioPhotosAction(formData);
      setUploadResult(result);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedCount(0);
      router.refresh();
    } finally {
      setIsUploading(false);
    }
  }

  async function runAction(
    id: string,
    fn: () => Promise<{ ok: boolean; error?: string }>
  ) {
    setBusyId(id);
    try {
      const result = await fn();
      if (!result.ok && result.error) {
        alert(result.error);
      }
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function persistOrder(ordered: AdminPortfolioPhoto[]) {
    setIsReordering(true);
    try {
      const result = await reorderPortfolioPhotosAction(
        ordered.map((photo) => photo.id)
      );
      if (!result.ok) {
        alert(result.error ?? "Failed to save photo order.");
        setPhotos(initialPhotos);
      } else {
        router.refresh();
      }
    } finally {
      setIsReordering(false);
      setDraggedId(null);
      setDragOverId(null);
    }
  }

  function reorderPhotos(fromId: string, toId: string) {
    if (fromId === toId) return;

    const next = [...photos];
    const fromIndex = next.findIndex((photo) => photo.id === fromId);
    const toIndex = next.findIndex((photo) => photo.id === toId);
    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setPhotos(next);
    void persistOrder(next);
  }

  function handleDragStart(id: string) {
    setDraggedId(id);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (draggedId && draggedId !== id) {
      setDragOverId(id);
    }
  }

  function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (draggedId) {
      reorderPhotos(draggedId, targetId);
    }
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  const interactionsDisabled = isReordering || busyId !== null;

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-bold text-rose-950"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Portfolio Admin
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Signed in as {adminEmail}
            </p>
          </div>
          <form action={signOutAdminAction}>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-rose-600 border border-stone-200 rounded-full transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>

        {/* Upload */}
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-rose-950 mb-3">
            Upload New Photos
          </h2>
          <form
            action={(formData) => {
              void handleUpload(formData);
            }}
            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
          >
            <input
              ref={fileInputRef}
              id="portfolio-upload-input"
              type="file"
              name="files"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              required
              onChange={(e) =>
                setSelectedCount(e.target.files?.length ?? 0)
              }
              className="sr-only"
            />
            <label
              htmlFor="portfolio-upload-input"
              className="flex-1 px-4 py-3 rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/50 text-sm text-stone-600 cursor-pointer transition-all duration-200 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-800"
            >
              {selectedCount > 0
                ? `${selectedCount} photo${selectedCount !== 1 ? "s" : ""} selected`
                : "Click to choose photos (JPG, PNG, WebP, GIF)"}
            </label>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-3 bg-rose-500 text-white text-sm font-bold rounded-full shadow-md transition-all duration-200 hover:bg-rose-600 hover:shadow-lg hover:ring-4 hover:ring-rose-200 hover:-translate-y-0.5 active:translate-y-0 disabled:bg-rose-300 disabled:shadow-none disabled:ring-0 disabled:translate-y-0 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isUploading ? "Uploading..." : "Upload Photos"}
            </button>
          </form>
          {uploadResult && (
            <div className="mt-3 text-sm space-y-1">
              {uploadResult.uploaded > 0 && (
                <p className="text-green-700">
                  Uploaded {uploadResult.uploaded} photo
                  {uploadResult.uploaded !== 1 ? "s" : ""}.
                </p>
              )}
              {uploadResult.errors.map((err, i) => (
                <p key={i} className="text-red-600">
                  {err}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Photo grid */}
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-rose-950">
              {photos.length} Photo{photos.length !== 1 ? "s" : ""}
            </h2>
            {photos.length > 1 && (
              <p className="text-xs text-stone-500">
                Drag a photo to reorder{isReordering ? " — saving…" : ""}
              </p>
            )}
          </div>
          {photos.length === 0 ? (
            <p className="text-sm text-stone-500">
              No photos yet — upload your first one above.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {photos.map((photo, index) => {
                const isDragging = draggedId === photo.id;
                const isDropTarget =
                  dragOverId === photo.id && draggedId !== photo.id;

                return (
                  <div
                    key={photo.id}
                    draggable={!interactionsDisabled}
                    onDragStart={() => handleDragStart(photo.id)}
                    onDragOver={(e) => handleDragOver(e, photo.id)}
                    onDrop={(e) => handleDrop(e, photo.id)}
                    onDragEnd={handleDragEnd}
                    className={`border rounded-2xl overflow-hidden bg-stone-50 transition-all duration-200 ${
                      isDragging
                        ? "opacity-40 scale-[0.98] border-rose-300 cursor-grabbing"
                        : isDropTarget
                          ? "border-rose-500 ring-4 ring-rose-200 shadow-lg scale-[1.02]"
                          : "border-stone-200 cursor-grab hover:border-rose-300 hover:shadow-md"
                    }`}
                  >
                    <div className="relative w-full aspect-square bg-stone-100">
                      <Image
                        src={photo.url}
                        alt={photo.altText || photo.storagePath}
                        fill
                        className="object-cover pointer-events-none"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        draggable={false}
                      />
                      <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
                        #{index + 1}
                      </span>
                      {!photo.isPublished && (
                        <span className="absolute top-2 right-2 bg-stone-900/80 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full">
                          Hidden
                        </span>
                      )}
                      <span className="absolute bottom-2 left-2 bg-white/90 text-stone-600 text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm">
                        ⋮⋮ drag to reorder
                      </span>
                    </div>
                    <div className="p-3 space-y-2">
                      <input
                        type="text"
                        defaultValue={photo.altText ?? ""}
                        placeholder="Alt text (for accessibility & SEO)"
                        disabled={interactionsDisabled}
                        onBlur={(e) => {
                          const value = e.target.value;
                          if (value !== (photo.altText ?? "")) {
                            runAction(photo.id, () =>
                              updatePortfolioPhotoDetailsAction(photo.id, {
                                altText: value,
                              })
                            );
                          }
                        }}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-200 focus:border-rose-400 outline-none disabled:opacity-50"
                      />
                      <div className="flex items-center justify-between gap-1.5 pt-1">
                        <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={photo.isPublished}
                            disabled={interactionsDisabled}
                            onChange={(e) =>
                              runAction(photo.id, () =>
                                setPortfolioPhotoPublishedAction(
                                  photo.id,
                                  e.target.checked
                                )
                              )
                            }
                          />
                          Published
                        </label>
                        <button
                          type="button"
                          disabled={interactionsDisabled}
                          onClick={() => {
                            if (
                              confirm(
                                "Delete this photo? This cannot be undone."
                              )
                            ) {
                              runAction(photo.id, () =>
                                deletePortfolioPhotoAction(photo.id)
                              );
                            }
                          }}
                          className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-red-600 disabled:text-stone-300 border border-stone-200 rounded-full transition-colors"
                          aria-label="Delete"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
