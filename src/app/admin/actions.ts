"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  registerPortfolioPhotos,
  updatePortfolioPhoto,
  movePortfolioPhoto,
  reorderPortfolioPhotos,
  deletePortfolioPhoto,
} from "@/lib/supabase/admin";

const MAX_UPLOAD_FILES = 20;
const MAX_PHOTO_TEXT_LENGTH = 500;

function revalidatePublicPortfolioPaths() {
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin");
}

export type UploadActionResult = { uploaded: number; errors: string[] };

/**
 * Records portfolio photos that were uploaded directly to Supabase Storage
 * from the browser (avoids Vercel's request body size limit on Server Actions).
 */
export async function registerPortfolioPhotosAction(
  storagePaths: string[]
): Promise<UploadActionResult> {
  await requireAdminUser();

  if (!Array.isArray(storagePaths) || storagePaths.length === 0) {
    return { uploaded: 0, errors: ["No uploaded photos to register."] };
  }

  const paths = storagePaths
    .filter((path): path is string => typeof path === "string")
    .slice(0, MAX_UPLOAD_FILES);

  const result = await registerPortfolioPhotos(paths);
  revalidatePublicPortfolioPaths();

  return { uploaded: result.uploaded, errors: result.errors };
}

export async function updatePortfolioPhotoDetailsAction(
  id: string,
  updates: { altText?: string; caption?: string }
): Promise<{ ok: boolean; error?: string }> {
  await requireAdminUser();
  // Blank fields become null so the public site falls back to generated alt
  // text instead of rendering alt="" (which hides the image from search).
  const clean = (value?: string) =>
    value === undefined ? undefined : value.trim().slice(0, MAX_PHOTO_TEXT_LENGTH) || null;
  const result = await updatePortfolioPhoto(id, {
    altText: clean(updates.altText),
    caption: clean(updates.caption),
  });
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
