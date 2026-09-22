# Mackenzie Rose Bakes 🎂

Custom cakes & baked goods website — built with Next.js 16, Tailwind CSS 4, and Supabase Storage. Optimized for NYC local SEO.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Fill in your credentials (see below).

### 3. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API → `service_role`. **Server-only — never expose to the client or commit it.** Powers the admin dashboard and signed inspiration-photo uploads. |
| `ADMIN_EMAILS` | Comma-separated allowlist of email addresses permitted to sign in to `/admin` (e.g. `you@example.com,mackenzie@example.com`). Case-insensitive. **Server-only.** |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `ORDER_EMAIL` | The inbox address that receives order form submissions |
| `GOOGLE_PLACES_API_KEY` | Google Cloud Console → APIs & Services → Credentials → create an API key (enable the Places API) |
| `GOOGLE_PLACE_ID` | Find yours at [developers.google.com/maps/documentation/places/web-service/place-id](https://developers.google.com/maps/documentation/places/web-service/place-id) — search for "Mackenzie Rose Bakes" |

> **Google Reviews:** `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` are optional. If they are not set, the site falls back to static example reviews automatically. Google reviews are cached for 24 hours so you won't burn API quota.

A ready-to-copy template lives at [.env.local.example](.env.local.example) — run `cp .env.local.example .env.local` and fill in real values.

---

## Admin dashboard (portfolio photo management)

Portfolio photos are managed at `/admin` instead of by uploading files directly in the Supabase dashboard.

1. Add every teammate who should have access to the `ADMIN_EMAILS` env var (comma-separated, no extra whitespace needed).
2. Visit `/admin/login` and sign in with **Password** (email + password) or **Magic link** (email only). Supabase uses email as the login identifier — there is no separate username.
3. **Set admin passwords** in Supabase dashboard → **Authentication → Users** → **Add user** (or open an existing user → **Reset password**). Use the same email as in `ADMIN_EMAILS` and check **Auto Confirm User** when creating the account.
4. Once signed in, `/admin` lets you upload new photos, edit alt text/captions, publish/unpublish, reorder, and delete — changes go live on `/` and `/portfolio` immediately.
5. Anyone not on the allowlist is redirected away from `/admin/*` without any indication of who is allowed, and unauthenticated requests are redirected to `/admin/login`.

**Auth emails (important):** Supabase’s built-in email service allows only **2 auth emails per hour for the whole project**. If you hit that while testing locally, you’ll see “email rate limit exceeded” even with a new address. Fix it by connecting **custom SMTP** (recommended anyway for production):

1. Supabase dashboard → **Authentication → SMTP Settings**
2. Enable custom SMTP and use your [Resend](https://resend.com) account:
   - **Host:** `smtp.resend.com`
   - **Port:** `465` (SSL) or `587` (TLS)
   - **Username:** `resend`
   - **Password:** your `RESEND_API_KEY`
   - **Sender email:** an address on a domain verified in Resend (e.g. `onboarding@resend.dev` for testing, or your own domain when verified)
3. Save, then Supabase dashboard → **Authentication → Rate Limits** — you can raise **Email sent** above the default 30/hour if needed.

**Required Supabase Auth configuration** (Supabase dashboard → **Authentication → URL Configuration**):

1. Set **Site URL** to your live domain, e.g. `https://www.mackenzierosebakes.com`
2. Add these to **Redirect URLs** (exact match — no trailing slash):
   - `http://localhost:3000/admin/auth/confirm` (local development)
   - `https://www.mackenzierosebakes.com/admin/auth/confirm` (production)
3. After changing redirect settings, request a **new** magic link — old links are one-time use and won't work again.

If magic links still fail after that, open **Authentication → Email Templates → Magic Link** and replace the link with this SSR-friendly version (uses `token_hash` instead of the default confirmation URL):

```html
<h2>Sign in to Mackenzie Rose Bakes Admin</h2>
<p><a href="{{ .SiteURL }}/admin/auth/confirm?token_hash={{ .TokenHash }}&type=email">Sign in</a></p>
```

Data lives in the namespaced `bakery_portfolio_photos` table and the existing `portfolio` Storage bucket (unchanged, still public-read for published photos only).

---

## Order proposal PDFs & customer inspiration uploads

When someone submits the order form, the app generates a branded PDF and emails it to `ORDER_EMAIL` for review, uploads that PDF to a private Storage bucket, and persists the submission (including any inspiration photos/links) to Supabase.

1. Create a **private** Storage bucket named `proposals` (Supabase → Storage → New bucket). It must **not** be public.
2. Create a **private** Storage bucket named `order-inspirations` for customer-uploaded inspiration photos. It must **not** be public — customers upload directly to it via short-lived signed upload URLs scoped to their own submission, and can never list or read other customers' files.
3. Add `SUPABASE_SERVICE_ROLE_KEY` to your environment (local and Vercel). Without it, emails still send with the PDF attached, but Storage/database persistence is skipped.

Customers can attach up to 5 inspiration photos (JPG/PNG/WebP, resized client-side before upload) and up to 5 reference links on the order form. This data is stored in the namespaced `bakery_order_submissions` and `bakery_order_inspiration_photos` tables and is never exposed publicly — only included in the PDF/email sent to `ORDER_EMAIL` via short-lived signed URLs.

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repository
3. Add the environment variables from the table above in the Vercel project settings
4. Deploy — Vercel auto-deploys on every push to `main`

**Update the site URL:** Before going live, update `https://mackenzierosebakes.com` in:
- `src/app/layout.tsx` → `metadataBase`
- `src/app/sitemap.ts` → `BASE_URL`
- `src/app/robots.ts` → `sitemap` URL

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, featured gallery, services preview, live Google reviews, about snippet |
| `/portfolio` | Full photo gallery (fetched from Supabase Storage) |
| `/services` | All services with details, pricing, and FAQs |
| `/order` | Order request form (submissions sent via Resend + PDF proposal; supports multi-photo/link inspiration uploads) |
| `/about` | About Mackenzie and her story |
| `/admin/login` | Allowlisted magic-link sign-in (noindex) |
| `/admin` | Portfolio photo management dashboard — requires an `ADMIN_EMAILS` allowlist match (noindex) |

---

## Tech Stack

- **Next.js 16** (App Router) — SSR for top SEO performance
- **Tailwind CSS 4** — Utility-first responsive styling
- **Supabase Storage** — Portfolio photo hosting, private proposal PDFs, and private customer inspiration uploads
- **Supabase Auth** — Allowlisted magic-link admin sign-in
- **Resend** — Order form email delivery via `/api/order`
- **Google Places API** — Live Google review feed (cached 24 h, optional)
- **Google Fonts** — Playfair Display + Lato
- **Vercel** — Hosting & deployment
