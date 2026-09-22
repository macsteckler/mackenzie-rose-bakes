import "server-only";
import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

/**
 * Service-role Supabase client and all privileged data access for:
 * - the admin portfolio dashboard (upload / publish / order / delete)
 * - generated proposal PDF archival
 * - customer inspiration photo uploads attached to order submissions
 *
 * Every export here runs server-only and uses the Supabase service role
 * key, which bypasses Row Level Security entirely. Callers (Server Actions,
 * Route Handlers) are responsible for authenticating/authorizing the caller
 * before invoking anything in this file.
 *
 * The service-role client holds no per-user/per-request state (unlike the
 * cookie-bound SSR client in `./server.ts`), so it is safe to cache as a
 * module-level singleton.
 */

const PORTFOLIO_BUCKET = "portfolio";
const PROPOSALS_BUCKET = "proposals";
const INSPIRATIONS_BUCKET = "order-inspirations";

const MAX_INSPIRATION_FILES = 5;
const MAX_INSPIRATION_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_INSPIRATION_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

let cachedAdminClient: SupabaseClient | null | undefined;

function getAdminClient(): SupabaseClient | null {
  if (cachedAdminClient !== undefined) return cachedAdminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.warn(
      "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY; admin features are disabled."
    );
    cachedAdminClient = null;
    return cachedAdminClient;
  }

  cachedAdminClient = createSupabaseClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedAdminClient;
}

function toPublicPortfolioUrl(admin: SupabaseClient, path: string): string {
  const { data } = admin.storage.from(PORTFOLIO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function safeStorageName(filename: string): string {
  const trimmed = filename.trim() || "file";
  return trimmed.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
}

type Result = { ok: true } | { ok: false; error: string };

// ---------------------------------------------------------------------------
// Portfolio: admin dashboard
// ---------------------------------------------------------------------------

export type AdminPortfolioPhoto = {
  id: string;
  storagePath: string;
  url: string;
  altText: string | null;
  caption: string | null;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
};

/** Full photo list (published + unpublished), ordered for the admin dashboard. */
export async function listPortfolioPhotosForAdmin(): Promise<
  AdminPortfolioPhoto[]
> {
  const admin = getAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("bakery_portfolio_photos")
    .select(
      "id, storage_path, alt_text, caption, is_published, display_order, created_at"
    )
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("[Admin] Failed to list portfolio photos:", error?.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id as string,
    storagePath: row.storage_path as string,
    url: toPublicPortfolioUrl(admin, row.storage_path as string),
    altText: (row.alt_text as string | null) ?? null,
    caption: (row.caption as string | null) ?? null,
    isPublished: row.is_published as boolean,
    displayOrder: row.display_order as number,
    createdAt: row.created_at as string,
  }));
}

export type PortfolioUploadFile = {
  filename: string;
  contentType: string;
  buffer: Buffer;
};

/** Uploads new portfolio images to Storage and inserts their metadata rows. */
export async function uploadPortfolioPhotos(
  files: PortfolioUploadFile[]
): Promise<{ uploaded: number; errors: string[] }> {
  const admin = getAdminClient();
  if (!admin) return { uploaded: 0, errors: ["Storage is not configured."] };

  const errors: string[] = [];
  let uploaded = 0;

  const { data: maxRow } = await admin
    .from("bakery_portfolio_photos")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextOrder = ((maxRow?.display_order as number | undefined) ?? -1) + 1;

  for (const file of files) {
    const path = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}-${safeStorageName(file.filename)}`;

    const { error: uploadError } = await admin.storage
      .from(PORTFOLIO_BUCKET)
      .upload(path, file.buffer, {
        contentType: file.contentType,
        upsert: false,
      });

    if (uploadError) {
      errors.push(`${file.filename}: ${uploadError.message}`);
      continue;
    }

    const { error: insertError } = await admin
      .from("bakery_portfolio_photos")
      .insert({ storage_path: path, is_published: true, display_order: nextOrder });

    if (insertError) {
      errors.push(`${file.filename}: ${insertError.message}`);
      await admin.storage.from(PORTFOLIO_BUCKET).remove([path]);
      continue;
    }

    nextOrder += 1;
    uploaded += 1;
  }

  return { uploaded, errors };
}

/** Updates alt text / caption / publish state for one portfolio photo. */
export async function updatePortfolioPhoto(
  id: string,
  updates: {
    altText?: string | null;
    caption?: string | null;
    isPublished?: boolean;
  }
): Promise<Result> {
  const admin = getAdminClient();
  if (!admin) return { ok: false, error: "Storage is not configured." };

  const payload: Record<string, unknown> = {};
  if (updates.altText !== undefined) payload.alt_text = updates.altText;
  if (updates.caption !== undefined) payload.caption = updates.caption;
  if (updates.isPublished !== undefined)
    payload.is_published = updates.isPublished;

  if (Object.keys(payload).length === 0) return { ok: true };

  const { error } = await admin
    .from("bakery_portfolio_photos")
    .update(payload)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Swaps a photo's display order with its neighbor to move it up or down. */
export async function movePortfolioPhoto(
  id: string,
  direction: "up" | "down"
): Promise<Result> {
  const admin = getAdminClient();
  if (!admin) return { ok: false, error: "Storage is not configured." };

  const { data: rows, error } = await admin
    .from("bakery_portfolio_photos")
    .select("id, display_order")
    .order("display_order", { ascending: true });

  if (error || !rows) {
    return { ok: false, error: error?.message ?? "Failed to load photos." };
  }

  const index = rows.findIndex((r) => r.id === id);
  if (index === -1) return { ok: false, error: "Photo not found." };

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= rows.length) return { ok: true };

  const a = rows[index];
  const b = rows[swapIndex];

  const [{ error: error1 }, { error: error2 }] = await Promise.all([
    admin
      .from("bakery_portfolio_photos")
      .update({ display_order: b.display_order })
      .eq("id", a.id),
    admin
      .from("bakery_portfolio_photos")
      .update({ display_order: a.display_order })
      .eq("id", b.id),
  ]);

  if (error1 || error2) {
    return {
      ok: false,
      error: error1?.message ?? error2?.message ?? "Failed to reorder photos.",
    };
  }
  return { ok: true };
}

/** Sets display order from a full list of photo IDs (index = order). */
export async function reorderPortfolioPhotos(
  orderedIds: string[]
): Promise<Result> {
  const admin = getAdminClient();
  if (!admin) return { ok: false, error: "Storage is not configured." };

  const { data: rows, error } = await admin
    .from("bakery_portfolio_photos")
    .select("id")
    .order("display_order", { ascending: true });

  if (error || !rows) {
    return { ok: false, error: error?.message ?? "Failed to load photos." };
  }

  const existingIds = new Set(rows.map((r) => r.id as string));
  if (
    orderedIds.length !== existingIds.size ||
    !orderedIds.every((id) => existingIds.has(id))
  ) {
    return { ok: false, error: "Invalid photo order." };
  }

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      admin
        .from("bakery_portfolio_photos")
        .update({ display_order: index })
        .eq("id", id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, error: failed.error.message };

  return { ok: true };
}

/** Permanently deletes a photo's storage object and its metadata row. */
export async function deletePortfolioPhoto(id: string): Promise<Result> {
  const admin = getAdminClient();
  if (!admin) return { ok: false, error: "Storage is not configured." };

  const { data: row, error: fetchError } = await admin
    .from("bakery_portfolio_photos")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !row) {
    return { ok: false, error: fetchError?.message ?? "Photo not found." };
  }

  const { error: deleteRowError } = await admin
    .from("bakery_portfolio_photos")
    .delete()
    .eq("id", id);

  if (deleteRowError) return { ok: false, error: deleteRowError.message };

  const { error: removeError } = await admin.storage
    .from(PORTFOLIO_BUCKET)
    .remove([row.storage_path as string]);

  if (removeError) {
    console.warn(
      "[Admin] Deleted photo row but failed to remove storage object:",
      removeError.message
    );
  }

  return { ok: true };
}

// ---------------------------------------------------------------------------
// Proposal PDFs (existing behavior, unchanged — now private bucket)
// ---------------------------------------------------------------------------

export async function uploadProposalPdf(
  buffer: Buffer,
  filename: string
): Promise<{ ok: boolean; path?: string; error?: string }> {
  const admin = getAdminClient();
  if (!admin) return { ok: false, error: "Storage is not configured." };

  const path = filename.replace(/^\/+/, "");
  const { data, error } = await admin.storage
    .from(PROPOSALS_BUCKET)
    .upload(path, buffer, { contentType: "application/pdf", upsert: false });

  if (error) {
    console.error("[Proposals] Supabase upload error:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true, path: data?.path ?? path };
}

// ---------------------------------------------------------------------------
// Customer order inspiration uploads
// ---------------------------------------------------------------------------

export type InspirationUploadRequest = {
  filename: string;
  contentType: string;
  size: number;
};

export type InspirationUploadTarget = {
  path: string;
  token: string;
  signedUrl: string;
  filename: string;
};

/**
 * Issues short-lived Supabase Storage signed upload URLs scoped to
 * `{submissionId}/{index}-{filename}` paths. The signed token itself is the
 * authorization — no Storage RLS policy is granted to `anon` for this
 * bucket, so a customer can only ever write to the exact path(s) we hand
 * back here, and cannot list or read anyone else's uploads.
 */
export async function createInspirationUploadTargets(
  submissionId: string,
  files: InspirationUploadRequest[]
): Promise<{ targets: InspirationUploadTarget[]; errors: string[] }> {
  const admin = getAdminClient();
  if (!admin) return { targets: [], errors: ["Storage is not configured."] };

  const errors: string[] = [];
  const accepted = files.slice(0, MAX_INSPIRATION_FILES);
  if (files.length > MAX_INSPIRATION_FILES) {
    errors.push(`Only the first ${MAX_INSPIRATION_FILES} photos were accepted.`);
  }

  const targets: InspirationUploadTarget[] = [];

  for (let i = 0; i < accepted.length; i++) {
    const file = accepted[i];

    if (!ALLOWED_INSPIRATION_TYPES.has(file.contentType)) {
      errors.push(`${file.filename}: unsupported file type.`);
      continue;
    }
    if (file.size > MAX_INSPIRATION_FILE_BYTES) {
      errors.push(`${file.filename}: file is larger than 8MB.`);
      continue;
    }

    const path = `${submissionId}/${i}-${safeStorageName(file.filename)}`;

    const { data, error } = await admin.storage
      .from(INSPIRATIONS_BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data) {
      errors.push(`${file.filename}: ${error?.message ?? "failed to create an upload URL."}`);
      continue;
    }

    targets.push({
      path,
      token: data.token,
      signedUrl: data.signedUrl,
      filename: file.filename,
    });
  }

  return { targets, errors };
}

export type InspirationPhotoRecord = {
  path: string;
  originalFilename?: string;
  contentType?: string;
  size?: number;
};

export type OrderSubmissionInput = {
  submissionId?: string;
  name?: string;
  email?: string;
  phone?: string;
  eventDate?: string;
  service?: string;
  servingSize?: string;
  flavors?: string;
  design?: string;
  dietary?: string;
  budget?: string;
  hearAbout?: string;
  message?: string;
  inspirationLinks?: string[];
};

/**
 * Persists the order submission, then confirms every claimed inspiration
 * photo path (a) is scoped to this submission and (b) actually exists in
 * Storage (i.e. really was uploaded) before recording it — a client can
 * claim any path in its own request, so we verify rather than trust it.
 */
export async function recordOrderSubmission(
  input: OrderSubmissionInput,
  inspirationPhotos: InspirationPhotoRecord[]
): Promise<{ ok: boolean; submissionId?: string; error?: string }> {
  const admin = getAdminClient();
  if (!admin) return { ok: false, error: "Storage is not configured." };

  const insertPayload: Record<string, unknown> = {
    name: input.name || null,
    email: input.email || null,
    phone: input.phone || null,
    event_date: input.eventDate || null,
    service: input.service || null,
    serving_size: input.servingSize || null,
    flavors: input.flavors || null,
    design: input.design || null,
    dietary: input.dietary || null,
    budget: input.budget || null,
    hear_about: input.hearAbout || null,
    message: input.message || null,
    inspiration_links: input.inspirationLinks ?? [],
  };
  if (input.submissionId) insertPayload.id = input.submissionId;

  const { data: inserted, error } = await admin
    .from("bakery_order_submissions")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error || !inserted) {
    return { ok: false, error: error?.message ?? "Failed to save submission." };
  }

  const submissionId = inserted.id as string;

  let confirmedPhotos: InspirationPhotoRecord[] = [];
  if (inspirationPhotos.length > 0) {
    const { data: existingFiles } = await admin.storage
      .from(INSPIRATIONS_BUCKET)
      .list(submissionId, { limit: 100 });
    const existingNames = new Set((existingFiles ?? []).map((f) => f.name));

    confirmedPhotos = inspirationPhotos.filter((photo) => {
      if (!photo.path.startsWith(`${submissionId}/`)) return false;
      const fileName = photo.path.slice(submissionId.length + 1);
      return existingNames.has(fileName);
    });
  }

  if (confirmedPhotos.length > 0) {
    const { error: photosError } = await admin
      .from("bakery_order_inspiration_photos")
      .insert(
        confirmedPhotos.map((p) => ({
          submission_id: submissionId,
          storage_path: p.path,
          original_filename: p.originalFilename ?? null,
          content_type: p.contentType ?? null,
          size_bytes: p.size ?? null,
        }))
      );

    if (photosError) {
      console.warn(
        "[Order] Failed to persist inspiration photo rows:",
        photosError.message
      );
    }
  }

  return { ok: true, submissionId };
}

/** Short-lived signed URL for staff to view a private inspiration photo. */
export async function getInspirationPhotoSignedUrl(
  path: string
): Promise<string | null> {
  const admin = getAdminClient();
  if (!admin) return null;

  const { data, error } = await admin.storage
    .from(INSPIRATIONS_BUCKET)
    .createSignedUrl(path, 60 * 60);

  if (error || !data) return null;
  return data.signedUrl;
}
