import type { Metadata } from "next";
import ServiceLanding, { type ServiceLandingContent } from "@/components/ServiceLanding";
import { getPublishedPortfolioPhotos } from "@/lib/supabase/public";
import { pageMetadata } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Corporate & Office Cakes NYC",
  description:
    "Cakes, cupcakes, and cookies for NYC offices — employee birthdays, company events, client gifts, and branded treats. Recurring orders and bulk discounts available.",
  path: "/corporate-cakes",
});

const content: ServiceLandingContent = {
  path: "/corporate-cakes",
  name: "Corporate & Office Cakes",
  eyebrow: "For NYC Businesses",
  heading: "Office & Event Cakes for",
  headingAccent: "NYC Teams",
  intro:
    "Custom cakes, cupcakes, and cookies for employee birthdays, company celebrations, client gifts, and events — delivered to offices across New York City.",
  startingPrice: "$45 / dozen cupcakes",
  orderService: "Corporate / Bulk Order",
  orderCta: "Request a Corporate Quote",
  highlights: [
    { icon: "🎉", title: "Employee Birthdays", desc: "Set up a recurring order so every birthday gets celebrated." },
    { icon: "🏢", title: "Office Delivery", desc: "Delivered to your office anywhere in New York City." },
    { icon: "✨", title: "Branded Treats", desc: "Cakes, cupcakes, and cookie assortments in your brand colors." },
    { icon: "📦", title: "Bulk Discounts", desc: "Better pricing for larger and repeat orders." },
  ],
  sections: [
    {
      heading: "Celebrate every employee birthday — without the planning",
      paragraphs: [
        "Office managers and People teams: we can set up a recurring order so birthdays, work anniversaries, and team wins always have a cake or a dozen cupcakes on the table. Tell us how often you need treats and how many people you're feeding, and we'll build a schedule that works for your office.",
      ],
    },
    {
      heading: "Company events, launches, and client gifts",
      paragraphs: [
        "Impress clients and celebrate your team with custom branded cakes, cupcakes, and cookie assortments — great for product launches, holiday parties, offsites, and company milestones. Cookie assortments come gift-ready, with individual cello bags available.",
        "We've made everything from navy-and-white cupcakes for a catered company event to game-day cupcakes with chocolate football toppers.",
      ],
    },
    {
      heading: "Delivered to offices across NYC",
      paragraphs: [
        "We're based in Midtown East and the Upper East Side — close to many Midtown offices — and deliver to workplaces throughout Manhattan, Brooklyn, Queens, the Bronx, and Staten Island.",
      ],
    },
  ],
  faqs: [
    { q: "Can you handle recurring orders for employee birthdays?", a: "Yes. We offer recurring order setups — let us know your team size and how often you'd like treats, and we'll put together a plan and quote." },
    { q: "Do you offer bulk or corporate pricing?", a: "Yes, bulk discounts are available for larger and repeat orders. Corporate orders are quoted individually." },
    { q: "Can you add our logo or brand colors?", a: "Yes. We make branded cakes, cupcakes, and cookie assortments in your company's colors." },
    { q: "Do you deliver to offices?", a: "Yes, we deliver to offices anywhere in New York City. Delivery fees vary by distance." },
    { q: "How much notice do you need?", a: "Most orders need at least 2–3 weeks' notice. Once a recurring order is set up, treats are scheduled ahead of time." },
  ],
  photoMatch: /cupcake|company|corporate|super bowl|macaron|bon bon/i,
  galleryHeading: "Cupcakes, Cookies & Treats",
};

export default async function CorporateCakesPage() {
  const photos = await getPublishedPortfolioPhotos();
  return <ServiceLanding content={content} photos={photos} />;
}
