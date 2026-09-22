import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = { email: string };

/** Server-only: parses the allowlisted admin emails from the environment. */
export function getAdminEmailAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmailAllowlist().includes(email.trim().toLowerCase());
}

/**
 * Server-only Data Access Layer check. Verifies the caller's session with
 * Supabase (`getClaims()` cryptographically validates the JWT — never trust
 * `getSession()` for authorization decisions) and confirms the email is on
 * the server-only `ADMIN_EMAILS` allowlist. Memoized per-request with
 * React's `cache()` so it's cheap to call from multiple places.
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const email = (data?.claims as { email?: string } | undefined)?.email;

  if (error || !email || !isAllowedAdminEmail(email)) {
    return null;
  }

  return { email };
});

/**
 * Call at the top of every admin page/layout AND independently inside every
 * admin Server Action — a page-level check does not extend automatically to
 * Server Actions defined or invoked from within it.
 */
export async function requireAdminUser(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}
