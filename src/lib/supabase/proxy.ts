import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Admin sub-paths that must stay reachable without an authenticated,
// allowlisted session (the login page itself and the magic-link callback).
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/auth"];

function getAdminEmailAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Refreshes the Supabase session on every request (so users stay signed in)
 * and performs an *optimistic* redirect for unauthenticated/non-allowlisted
 * visitors to protected `/admin` routes. This is a fast, cookie-only check —
 * the authoritative check lives in `src/lib/admin-auth.ts` and is re-run on
 * every admin page and Server Action.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase isn't configured in this environment; don't block requests.
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value)
        );
      },
    },
  });

  // Do not run code between createServerClient and getClaims(). A simple
  // mistake could make it very hard to debug issues with users being
  // randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const email = (data?.claims as { email?: string } | undefined)?.email;

  const pathname = request.nextUrl.pathname;
  const isProtectedAdminPath =
    pathname.startsWith("/admin") &&
    !PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path));

  if (isProtectedAdminPath) {
    const allowlist = getAdminEmailAllowlist();
    const isAuthorized = !!email && allowlist.includes(email.trim().toLowerCase());

    if (!isAuthorized) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      const redirectResponse = NextResponse.redirect(url);
      // Preserve any refreshed session cookies on the redirect response.
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });
      return redirectResponse;
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is (or a
  // copy that preserves its cookies). If this is not done, the browser and
  // server can go out of sync and terminate the user's session prematurely.
  return supabaseResponse;
}
