import type { Metadata } from "next";
import ServiceLanding, { type ServiceLandingContent } from "@/components/ServiceLanding";
import { getPublishedPortfolioPhotos } from "@/lib/supabase/public";
import { pageMetadata } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Wedding Cakes NYC — Custom Tiered Cakes",
  description:
    "Custom wedding cakes in New York City from $300, with a complimentary tasting consultation, hand-piped buttercream detail, and delivery & setup anywhere in NYC.",
  path: "/wedding-cakes",
});

const content: ServiceLandingContent = {
  path: "/wedding-cakes",
  name: "Wedding Cakes",
  eyebrow: "Wedding Cakes in NYC",
  heading: "Custom Wedding Cakes in",
  headingAccent: "New York City",
  intro:
    "Tiered wedding cakes designed around your day — from romantic vintage piping to clean modern minimalism. Made from scratch, based in Midtown East & the Upper East Side, and delivered and set up anywhere in the city.",
  startingPrice: "$300",
  orderService: "Wedding Cake",
  orderCta: "Start Your Wedding Cake",
  highlights: [
    { icon: "🍰", title: "Complimentary Tasting", desc: "Every wedding client gets a tasting consultation to choose flavors together." },
    { icon: "💐", title: "Hand-Piped Detail", desc: "Custom floral piping, garlands, and intricate buttercream work." },
    { icon: "🎂", title: "Any Guest Count", desc: "Tiered designs sized for your guest list, plus cutting & dessert cake options." },
    { icon: "🚚", title: "Delivery & Setup", desc: "We deliver and set up at your venue anywhere in New York City." },
  ],
  sections: [
    {
      heading: "A wedding cake designed with you",
      paragraphs: [
        "Your wedding cake should feel like the rest of your day. We start with a conversation about your aesthetic — your florals, colors, venue, and the details you love — and design a cake that fits, whether that's romantic florals, modern minimalism, or bold maximalism.",
        "Every cake is baked from scratch with real ingredients and finished by hand. Vintage-style piped cakes are a specialty: ruffled borders, garlands, rosettes, and fresh fruit or flowers.",
      ],
    },
    {
      heading: "Cutting cakes, dessert cakes, and tiers",
      paragraphs: [
        "Planning a large guest count? A smaller display cake paired with cutting or dessert cakes is a beautiful way to serve everyone without an oversized centerpiece. We'll help you work out the right sizes when you request your quote.",
      ],
    },
    {
      heading: "Weddings across all five boroughs",
      paragraphs: [
        "We're based in Midtown East and the Upper East Side, and we deliver wedding cakes to venues throughout Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. Delivery fees vary by distance.",
      ],
    },
  ],
  faqs: [
    { q: "How far in advance should I order a wedding cake?", a: "We recommend booking your wedding cake 4–6 weeks in advance. Popular dates fill up quickly around wedding season, so reaching out early is best." },
    { q: "Do you offer wedding cake tastings?", a: "Yes — every wedding cake client receives a complimentary tasting consultation." },
    { q: "Do you deliver and set up at the venue?", a: "Yes. We deliver and set up wedding cakes anywhere in New York City. Delivery fees vary by distance." },
    { q: "How much does a wedding cake cost?", a: "Wedding cakes start at $300. Final pricing depends on size, number of tiers, design detail, and flavors — we'll send a quote after you submit your request." },
    { q: "How do I reserve my date?", a: "A 50% non-refundable deposit secures your date, and the remaining balance is due one week before your wedding." },
  ],
  photoMatch: /wedding|married|bridal|tiered|two-tier|ivory/i,
  galleryHeading: "Wedding & Tiered Cakes From Our Kitchen",
};

export default async function WeddingCakesPage() {
  const photos = await getPublishedPortfolioPhotos();
  return <ServiceLanding content={content} photos={photos} />;
}
