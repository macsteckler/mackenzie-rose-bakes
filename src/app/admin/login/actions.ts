"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAllowedAdminEmail } from "@/lib/admin-auth";
import { SITE_URL } from "@/lib/site";

/**
 * Resolves the origin to redirect back to after the magic link is clicked.
 * `SITE_URL` is a hardcoded production URL, which would break local/staging
 * testing if used directly — so prefer the actual request origin (works for
 * localhost, preview deployments, and production alike) and only fall back
 * to `SITE_URL` if that header is unexpectedly missing.
 */
async function getRedirectOrigin(): Promise<string> {
  const headerList = await headers();
  const origin = headerList.get("origin");
  if (origin) return origin;

  const host = headerList.get("host");
  if (host) {
    const forwarded = headerList.get("x-forwarded-proto");
    const isLocal =
      host.startsWith("localhost") || host.startsWith("127.0.0.1");
    const proto = forwarded ?? (isLocal ? "http" : "https");
    return `${proto}://${host}`;
  }

  return SITE_URL;
}

export type LoginActionState = {
  status: "idle" | "sent" | "invalid" | "rate_limited";
};

export type PasswordLoginActionState = {
  status: "idle" | "invalid" | "failed";
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sends a Supabase magic link to the given email — but only actually calls
 * Supabase (and therefore only sends an email / creates an auth user) when
 * the address is on the server-only `ADMIN_EMAILS` allowlist. Either way,
 * the response is identical, so this never reveals which emails are admins.
 */
export async function requestAdminMagicLink(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return { status: "invalid" };
  }

  if (isAllowedAdminEmail(email)) {
    const supabase = await createClient();
    const origin = await getRedirectOrigin();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${origin}/admin/auth/confirm`,
      },
    });
    if (error) {
      console.error("[Admin] signInWithOtp error:", error.message);
      if (/rate limit/i.test(error.message)) {
        return { status: "rate_limited" };
      }
    }
  }

  return { status: "sent" };
}

/**
 * Email + password sign-in for allowlisted admins. Supabase Auth uses email
 * as the login identifier (there is no separate username field).
 */
export async function signInAdminWithPassword(
  _prevState: PasswordLoginActionState,
  formData: FormData
): Promise<PasswordLoginActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !EMAIL_RE.test(email) || !password) {
    return { status: "invalid" };
  }

  if (!isAllowedAdminEmail(email)) {
    return { status: "failed" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[Admin] signInWithPassword error:", error.message);
    return { status: "failed" };
  }

  redirect("/admin");
}
