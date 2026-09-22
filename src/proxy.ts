import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// NOTE: As of Next.js 16, the `middleware.ts` file convention was renamed to
// `proxy.ts` (the exported function is now named `proxy`, not `middleware`).
// See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, common image extensions, and other static assets
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt)$).*)",
  ],
};
