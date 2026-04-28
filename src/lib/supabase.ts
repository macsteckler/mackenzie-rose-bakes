import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const PROP_BUCKET = "proposals";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

export async function getPortfolioPhotos(): Promise<
  { url: string; name: string }[]
> {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client.storage.from("portfolio").list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      console.error("[Portfolio] Supabase list error:", error.message);
      return [];
    }
    if (!data) return [];

    return data
      .filter(
        (file) =>
          file.name !== ".emptyFolderPlaceholder" &&
          /\.(jpg|jpeg|png|gif|webp|avif|heic|heif)$/i.test(file.name)
      )
      .map((file) => {
        const { data: urlData } = client.storage
          .from("portfolio")
          .getPublicUrl(file.name);
        return { url: urlData.publicUrl, name: file.name };
      });
  } catch (err) {
    console.error("[Portfolio] Unexpected error fetching photos:", err);
    return [];
  }
}

/** Server-only: uploads a generated proposal PDF to private Storage. Requires `proposals` bucket + `SUPABASE_SERVICE_ROLE_KEY`. */
export async function uploadProposalPdf(
  buffer: Buffer,
  filename: string
): Promise<{ ok: boolean; path?: string; error?: string }> {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) {
    return { ok: false, error: "Storage not configured" };
  }

  const admin = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const path = filename.replace(/^\/+/, "");
  const { data, error } = await admin.storage
    .from(PROP_BUCKET)
    .upload(path, buffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) {
    console.error("[Proposals] Supabase upload error:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true, path: data?.path ?? path };
}
