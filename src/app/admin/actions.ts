"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  uploadPortfolioPhotos,
  updatePortfolioPhoto,
  movePortfolioPhoto,
  reorderPortfolioPhotos,
  deletePortfolioPhoto,
} from "@/lib/supabase/admin";

const MAX_UPLOAD_FILES = 20;
const MAX_UPLOAD_FILE_BYTES = 15 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function revalidatePublicPortfolioPaths() {
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin");
}

export type UploadActionResult = { uploaded: number; errors: string[] };

/**
 * Uploads one or more portfolio photos. Re-verifies the admin session on
 * every call — a page-level check does not protect Server Actions invoked
 * from it.
 */
export async function uploadPortfolioPhotosAction(
  formData: FormData
): Promise<UploadActionResult> {
  await requireAdminUser();

  const entries = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (entries.length === 0) {
    return { uploaded: 0, errors: ["No files were selected."] };
  }

  const errors: string[] = [];
  const files: { filename: string; contentType: string; buffer: Buffer }[] = [];

  for (const file of entries.slice(0, MAX_UPLOAD_FILES)) {
    if (!ALLOWED_UPLOAD_TYPES.has(file.type)) {
      errors.push(`${file.name}: unsupported file type.`);
      continue;
    }
    if (file.size > MAX_UPLOAD_FILE_BYTES) {
      errors.push(`${file.name}: file is larger than 15MB.`);
      continue;
    }
    const arrayBuffer = await file.arrayBuffer();
    files.push({
      filename: file.name,
      contentType: file.type,
      buffer: Buffer.from(arrayBuffer),
    });
  }

  const result = await uploadPortfolioPhotos(files);
  revalidatePublicPortfolioPaths();

  return { uploaded: result.uploaded, errors: [...errors, ...result.errors] };
}

export async function updatePortfolioPhotoDetailsAction(
  id: string,
  updates: { altText?: string; caption?: string }
): Promise<{ ok: boolean; error?: string }> {
  await requireAdminUser();
  const result = await updatePortfolioPhoto(id, updates);
  revalidatePublicPortfolioPaths();
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function setPortfolioPhotoPublishedAction(
  id: string,
  isPublished: boolean
): Promise<{ ok: boolean; error?: string }> {
  await requireAdminUser();
  const result = await updatePortfolioPhoto(id, { isPublished });
  revalidatePublicPortfolioPaths();
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function movePortfolioPhotoAction(
  id: string,
  direction: "up" | "down"
): Promise<{ ok: boolean; error?: string }> {
  await requireAdminUser();
  const result = await movePortfolioPhoto(id, direction);
  revalidatePublicPortfolioPaths();
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function reorderPortfolioPhotosAction(
  orderedIds: string[]
): Promise<{ ok: boolean; error?: string }> {
  await requireAdminUser();
  const result = await reorderPortfolioPhotos(orderedIds);
  revalidatePublicPortfolioPaths();
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function deletePortfolioPhotoAction(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdminUser();
  const result = await deletePortfolioPhoto(id);
  revalidatePublicPortfolioPaths();
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function signOutAdminAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
