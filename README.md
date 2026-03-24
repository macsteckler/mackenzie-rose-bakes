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
Fill in your Supabase and Formspree credentials (see below).

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
| `NEXT_PUBLIC_FORMSPREE_ID` | [formspree.io](https://formspree.io) → create a form → copy the ID |

---

## Adding Portfolio Photos

1. Go to your [Supabase dashboard](https://supabase.com/dashboard)
2. Navigate to **Storage**
3. Create a bucket named exactly `portfolio` (set to **Public**)
4. Upload any `.jpg`, `.jpeg`, `.png`, `.webp`, or `.gif` images
5. The portfolio page automatically fetches and displays them — no code changes or redeployment needed

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repository
3. Add all three environment variables in the Vercel project settings
4. Deploy — Vercel auto-deploys on every push to `main`

**Update the site URL:** Before going live, update `https://mackenzierosebakes.com` in:
- `src/app/layout.tsx` → `metadataBase`
- `src/app/sitemap.ts` → `BASE_URL`
- `src/app/robots.ts` → `sitemap` URL

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, featured gallery, services preview, testimonials |
| `/portfolio` | Full photo gallery (fetched from Supabase Storage) |
| `/services` | All services with details, pricing, and FAQs |
| `/order` | Order request form (sent via Formspree to your email) |
| `/about` | About Mackenzie and her story |

---

## Tech Stack

- **Next.js 16** (App Router) — SSR for top SEO performance
- **Tailwind CSS 4** — Utility-first responsive styling
- **Supabase Storage** — Portfolio photo hosting
- **Formspree** — Order form email delivery (no backend needed)
- **Google Fonts** — Playfair Display + Lato
- **Vercel** — Hosting & deployment
