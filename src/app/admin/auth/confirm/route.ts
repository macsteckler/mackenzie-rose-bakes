import { createServerClient } from "@supabase/ssr";
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Handles the Supabase magic-link callback for the admin login flow.
 *
 * Supabase can arrive here in two ways depending on the email template:
 * - Default template: `?code=...` (PKCE) → exchangeCodeForSession
 * - SSR template: `?token_hash=...&type=email` → verifyOtp
 *
 * Session cookies must be written onto the redirect Response itself —
 * using `cookies()` alone is not reliable for Route Handler redirects.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  const successRedirect = request.nextUrl.clone();
  successRedirect.pathname = "/admin";
  successRedirect.search = "";
  const response = NextResponse.redirect(successRedirect);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[Admin auth confirm] Supabase env vars are missing.");
    return redirectToLoginError(request);
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return response;
    console.error(
      "[Admin auth confirm] exchangeCodeForSession failed:",
      error.message
    );
  } else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) return response;
    console.error("[Admin auth confirm] verifyOtp failed:", error.message);
  } else {
    console.error(
      "[Admin auth confirm] Missing auth params in callback URL:",
      url.search
    );
  }

  return redirectToLoginError(request);
}

function redirectToLoginError(request: NextRequest) {
  const errorRedirect = request.nextUrl.clone();
  errorRedirect.pathname = "/admin/login";
  errorRedirect.search = "?error=1";
  return NextResponse.redirect(errorRedirect);
}
