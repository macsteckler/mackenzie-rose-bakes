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
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `ORDER_EMAIL` | The inbox address that receives order form submissions |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API → `service_role` (server-only; never expose to the client). Used to upload generated order proposal PDFs to private Storage. |
| `GOOGLE_PLACES_API_KEY` | Google Cloud Console → APIs & Services → Credentials → create an API key (enable the Places API) |
| `GOOGLE_PLACE_ID` | Find yours at [developers.google.com/maps/documentation/places/web-service/place-id](https://developers.google.com/maps/documentation/places/web-service/place-id) — search for "Mackenzie Rose Bakes" |

> **Google Reviews:** `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` are optional. If they are not set, the site falls back to static example reviews automatically. Google reviews are cached for 24 hours so you won't burn API quota.

---

## Adding Portfolio Photos

1. Go to your [Supabase dashboard](https://supabase.com/dashboard)
2. Navigate to **Storage**
3. Create a bucket named exactly `portfolio` (set to **Public**)
4. Upload any `.jpg`, `.jpeg`, `.png`, `.webp`, or `.gif` images
5. The portfolio page automatically fetches and displays them — no code changes or redeployment needed

---

## Order proposal PDFs

When someone submits the order form, the app generates a branded PDF and emails it to `ORDER_EMAIL` for review. The same file is uploaded to Supabase Storage for a future admin flow.

1. Create a **private** Storage bucket named `proposals` (Supabase → Storage → New bucket).
2. Add `SUPABASE_SERVICE_ROLE_KEY` to your environment (local and Vercel). Without it, emails still send with the PDF attached, but uploads are skipped.

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
| `/order` | Order request form (submissions sent via Resend + PDF proposal) |
| `/about` | About Mackenzie and her story |

---

## Tech Stack

- **Next.js 16** (App Router) — SSR for top SEO performance
- **Tailwind CSS 4** — Utility-first responsive styling
- **Supabase Storage** — Portfolio photo hosting
- **Resend** — Order form email delivery via `/api/order`
- **Google Places API** — Live Google review feed (cached 24 h, optional)
- **Google Fonts** — Playfair Display + Lato
- **Vercel** — Hosting & deployment
