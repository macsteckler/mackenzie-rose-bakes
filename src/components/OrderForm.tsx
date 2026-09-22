"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const serviceOptions = [
  "Birthday Cake",
  "Wedding Cake",
  "Cupcakes",
  "Custom Cookie Assortment",
  "Celebration Cake",
  "Corporate / Bulk Order",
  "Your Vision, Made Real (Custom / Misc)",
  "Other",
];

const budgetRanges = [
  "Under $100",
  "$100 – $200",
  "$200 – $400",
  "$400 – $600",
  "$600+",
  "Not sure yet",
];

type FormState = "idle" | "submitting" | "success" | "error";

const MAX_INSPIRATION_PHOTOS = 5;
const MAX_INSPIRATION_LINKS = 5;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type InspirationPhoto = {
  id: string;
  file: File;
  previewUrl: string;
  status: "uploading" | "done" | "error";
  path?: string;
  error?: string;
};

function createSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generator for older browsers.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Resizes/compresses an image client-side so mobile uploads stay small and fast. */
async function resizeImageFile(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    if ("close" in bitmap) bitmap.close();

    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, outputType, JPEG_QUALITY)
    );
    if (!blob) return file;

    const newName = file.name.replace(
      /\.(png|jpe?g|webp|gif)$/i,
      outputType === "image/png" ? ".png" : ".jpg"
    );
    return new File([blob], newName || "photo.jpg", { type: outputType });
  } catch {
    return file;
  }
}

export default function OrderForm() {
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    service: "",
    servingSize: "",
    flavors: "",
    design: "",
    dietary: "",
    budget: "",
    hearAbout: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [submissionId, setSubmissionId] = useState(() => createSubmissionId());
  const [inspirationLinks, setInspirationLinks] = useState<string[]>([""]);
  const [inspirationPhotos, setInspirationPhotos] = useState<
    InspirationPhoto[]
  >([]);
  const [photoNotice, setPhotoNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<InspirationPhoto[]>([]);

  useEffect(() => {
    const service = searchParams.get("service");
    if (service) {
      setFormData((prev) => ({ ...prev, service }));
    }
  }, [searchParams]);

  // Keep a ref of the latest photos (for unmount cleanup below) without
  // triggering renders — updated after render via effect, not during render.
  useEffect(() => {
    photosRef.current = inspirationPhotos;
  }, [inspirationPhotos]);

  // Revoke any outstanding preview object URLs when the form unmounts.
  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const uploadInspirationPhoto = useCallback(
    async (id: string, file: File) => {
      try {
        const res = await fetch("/api/order/inspiration-upload-urls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId,
            files: [
              { filename: file.name, contentType: file.type, size: file.size },
            ],
          }),
        });
        const data = await res.json();
        const target = data?.targets?.[0];
        if (!res.ok || !target) {
          const message =
            data?.errors?.[0] || data?.error || "Upload failed.";
          setInspirationPhotos((prev) =>
            prev.map((p) =>
              p.id === id ? { ...p, status: "error", error: message } : p
            )
          );
          return;
        }

        const supabase = createClient();
        const { error } = await supabase.storage
          .from("order-inspirations")
          .uploadToSignedUrl(target.path, target.token, file);

        if (error) {
          setInspirationPhotos((prev) =>
            prev.map((p) =>
              p.id === id
                ? { ...p, status: "error", error: error.message }
                : p
            )
          );
          return;
        }

        setInspirationPhotos((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, status: "done", path: target.path } : p
          )
        );
      } catch {
        setInspirationPhotos((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, status: "error", error: "Upload failed." }
              : p
          )
        );
      }
    },
    [submissionId]
  );

  const handlePhotoSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setPhotoNotice(null);
    const remainingSlots = MAX_INSPIRATION_PHOTOS - inspirationPhotos.length;
    const toProcess = files.slice(0, Math.max(0, remainingSlots));
    if (files.length > toProcess.length) {
      setPhotoNotice(`You can attach up to ${MAX_INSPIRATION_PHOTOS} photos.`);
    }

    for (const file of toProcess) {
      if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
        setPhotoNotice(`${file.name}: only JPG, PNG, or WebP photos are supported.`);
        continue;
      }

      const resized = await resizeImageFile(file);
      if (resized.size > MAX_UPLOAD_BYTES) {
        setPhotoNotice(`${file.name}: photo is too large even after compression.`);
        continue;
      }

      const id = createSubmissionId();
      const previewUrl = URL.createObjectURL(resized);
      setInspirationPhotos((prev) => [
        ...prev,
        { id, file: resized, previewUrl, status: "uploading" },
      ]);
      void uploadInspirationPhoto(id, resized);
    }
  };

  const removeInspirationPhoto = (id: string) => {
    setInspirationPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const updateInspirationLink = (index: number, value: string) => {
    setInspirationLinks((prev) =>
      prev.map((link, i) => (i === index ? value : link))
    );
  };

  const addInspirationLink = () => {
    setInspirationLinks((prev) =>
      prev.length >= MAX_INSPIRATION_LINKS ? prev : [...prev, ""]
    );
  };

  const removeInspirationLink = (index: number) => {
    setInspirationLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const resetInspiration = () => {
    inspirationPhotos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setInspirationPhotos([]);
    setInspirationLinks([""]);
    setPhotoNotice(null);
    setSubmissionId(createSubmissionId());
  };

  const photosStillUploading = inspirationPhotos.some(
    (p) => p.status === "uploading"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (honeypot.trim() !== "") {
      // Silently "succeed" for bots without sending anything.
      setFormState("success");
      return;
    }

    if (photosStillUploading) {
      setErrorMessage("Please wait for your photos to finish uploading.");
      return;
    }

    setErrorMessage(null);
    setFormState("submitting");

    const cleanLinks = inspirationLinks
      .map((link) => link.trim())
      .filter(Boolean);
    const readyPhotos = inspirationPhotos.filter((p) => p.status === "done");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          honeypot,
          submissionId,
          inspirationLinks: cleanLinks,
          inspirationPhotos: readyPhotos.map((p) => ({
            path: p.path,
            originalFilename: p.file.name,
            contentType: p.file.type,
            size: p.file.size,
          })),
        }),
      });
      if (res.ok) {
        setFormState("success");
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <div className="bg-rose-50 rounded-3xl border border-rose-100 p-12 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2
          className="text-3xl font-bold text-rose-950 mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Order Request Sent!
        </h2>
        <p className="text-stone-600 max-w-sm mx-auto mb-6">
          Thank you so much! Mackenzie will be in touch within 24 hours to
          discuss your order. We can&apos;t wait to bake for you! 🍰
        </p>
        <button
          onClick={() => {
            setFormState("idle");
            setErrorMessage(null);
            setFormData({
              name: "",
              email: "",
              phone: "",
              eventDate: "",
              service: "",
              servingSize: "",
              flavors: "",
              design: "",
              dietary: "",
              budget: "",
              hearAbout: "",
              message: "",
            });
            setHoneypot("");
            resetInspiration();
          }}
          className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 space-y-6"
    >
      <h2
        className="text-2xl font-bold text-rose-950"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Order Request Form
      </h2>

      {/* Honeypot — hidden from real users, visible to bots */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor="companyWebsite">Company Website</label>
        <input
          type="text"
          id="companyWebsite"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-widest">
          Contact Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(212) 555-0123"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Event Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              name="eventDate"
              required
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-widest">
          Order Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Service Type <span className="text-rose-400">*</span>
            </label>
            <select
              name="service"
              required
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm bg-white"
            >
              <option value="" disabled>
                Select a service...
              </option>
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Approximate Serving Size
            </label>
            <input
              type="text"
              name="servingSize"
              value={formData.servingSize}
              onChange={handleChange}
              placeholder="e.g. 20 guests, 2 dozen cupcakes"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Flavor(s) You&apos;re Thinking Of
          </label>
          <input
            type="text"
            name="flavors"
            value={formData.flavors}
            onChange={handleChange}
            placeholder="e.g. vanilla bean cake, strawberry buttercream, chocolate ganache"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Design Ideas / Theme <span className="text-rose-400">*</span>
          </label>
          <textarea
            name="design"
            required
            rows={3}
            value={formData.design}
            onChange={handleChange}
            placeholder="Describe your vision — colors, themes, inspiration photos, style (modern, rustic, whimsical, etc.)"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300 resize-none"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Dietary Restrictions / Allergies
            </label>
            <input
              type="text"
              name="dietary"
              value={formData.dietary}
              onChange={handleChange}
              placeholder="e.g. gluten-free, dairy-free, nut allergy"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Budget Range
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm bg-white"
            >
              <option value="">Select a range...</option>
              {budgetRanges.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inspiration */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-widest">
          Inspiration (Optional)
        </h3>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Inspiration Photos
          </label>
          <p className="text-xs text-stone-400 mb-2">
            Upload up to {MAX_INSPIRATION_PHOTOS} photos (JPG, PNG, or WebP).
            These are kept private and only shared with Mackenzie.
          </p>

          {inspirationPhotos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
              {inspirationPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.previewUrl}
                    alt="Inspiration preview"
                    className="w-full h-full object-cover"
                  />
                  {photo.status === "uploading" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-[10px] font-semibold">
                        Uploading…
                      </span>
                    </div>
                  )}
                  {photo.status === "error" && (
                    <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center p-1">
                      <span className="text-white text-[9px] text-center leading-tight">
                        {photo.error || "Upload failed"}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeInspirationPhoto(photo.id)}
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-white/90 text-stone-700 text-xs font-bold shadow"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {inspirationPhotos.length < MAX_INSPIRATION_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 text-sm font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-xl transition-colors"
            >
              + Add Photo{inspirationPhotos.length > 0 ? "s" : ""}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handlePhotoSelect}
            className="hidden"
          />
          {photoNotice && (
            <p className="text-xs text-amber-600 mt-2">{photoNotice}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Inspiration Links (Pinterest, Instagram, etc.)
          </label>
          <div className="space-y-2">
            {inspirationLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => updateInspirationLink(index, e.target.value)}
                  placeholder="https://pinterest.com/pin/..."
                  className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
                />
                {inspirationLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInspirationLink(index)}
                    aria-label="Remove link"
                    className="px-3 rounded-xl border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-200 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          {inspirationLinks.length < MAX_INSPIRATION_LINKS && (
            <button
              type="button"
              onClick={addInspirationLink}
              className="mt-2 text-sm font-semibold text-rose-600 hover:text-rose-700"
            >
              + Add another link
            </button>
          )}
        </div>
      </div>

      {/* Additional */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-widest">
          Anything Else?
        </h3>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Additional Notes or Questions
          </label>
          <textarea
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="Anything else we should know? Delivery address, special requests, reference photos links, etc."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            How Did You Hear About Us?
          </label>
          <input
            type="text"
            name="hearAbout"
            value={formData.hearAbout}
            onChange={handleChange}
            placeholder="Google, Instagram, word of mouth, etc."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
          />
        </div>
      </div>

      {errorMessage && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          {errorMessage}
        </div>
      )}

      {formState === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          Something went wrong submitting your request. Please try again or reach out directly.
        </div>
      )}

      <button
        type="submit"
        disabled={formState === "submitting" || photosStillUploading}
        className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold text-base rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {formState === "submitting"
          ? "Sending..."
          : photosStillUploading
            ? "Uploading photos…"
            : "Send My Order Request 🎂"}
      </button>
      <p className="text-center text-xs text-stone-400">
        We&apos;ll get back to you within 24 hours · No payment required yet
      </p>
    </form>
  );
}
