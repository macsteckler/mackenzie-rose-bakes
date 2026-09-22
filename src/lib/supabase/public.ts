import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const PORTFOLIO_BUCKET = "portfolio";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export type PortfolioPhoto = {
  url: string;
  name: string;
  altText: string | null;
};

/**
 * Public, unauthenticated read of portfolio photos. Uses the anon key —
 * Row Level Security on `bakery_portfolio_photos` ensures only rows with
 * `is_published = true` are ever returned, regardless of what this code
 * requests.
 */
export async function getPublishedPortfolioPhotos(): Promise<PortfolioPhoto[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const client = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await client
    .from("bakery_portfolio_photos")
    .select("storage_path, alt_text")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("[Portfolio] Failed to load published photos:", error?.message);
    return [];
  }

  return data.map((row) => {
    const { data: urlData } = client.storage
      .from(PORTFOLIO_BUCKET)
      .getPublicUrl(row.storage_path as string);
    return {
      url: urlData.publicUrl,
      name: row.storage_path as string,
      altText: (row.alt_text as string | null) ?? null,
    };
  });
}
