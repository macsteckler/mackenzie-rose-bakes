import type { Metadata } from "next";
import ServiceLanding, { type ServiceLandingContent } from "@/components/ServiceLanding";
import { getPublishedPortfolioPhotos } from "@/lib/supabase/public";
import { pageMetadata } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Custom Cakes NYC — For Any Occasion",
  description:
    "Custom cakes in New York City from $115 — for birthdays, showers, anniversaries, graduations, and any celebration. Any flavor, any design, delivered anywhere in NYC.",
  path: "/custom-cakes",
});

const content: ServiceLandingContent = {
  path: "/custom-cakes",
  name: "Custom Cakes",
  eyebrow: "Custom Cakes in NYC",
  heading: "Custom Cakes in",
  headingAccent: "New York City",
  intro:
    "One-of-a-kind cakes for any occasion — designed around your vision and baked from scratch on Manhattan's East Side. Pickup or delivery anywhere in NYC.",
  startingPrice: "$115",
  orderCta: "Design Your Cake",
  highlights: [
    { icon: "🎨", title: "Fully Custom", desc: "Custom colors, themes, and lettering — no templates." },
    { icon: "🍓", title: "Any Flavor", desc: "Any flavor or combination, with scratch-made buttercream and fillings." },
    { icon: "🎂", title: "1–6 Tiers", desc: "From an intimate 6-inch cake to a multi-tier centerpiece." },
    { icon: "🗽", title: "Delivered in NYC", desc: "Pickup or delivery anywhere in the five boroughs." },
  ],
  sections: [
    {
      heading: "A cake as unique as your celebration",
      paragraphs: [
        "Every custom cake starts with your idea: a color palette, a hobby, an inside joke, or a photo you've saved. We turn it into a cake that's built from scratch — from whimsical and colorful to sleek and elegant.",
        "Vintage-style piped cakes are a signature: ruffled borders, bows, pearl sprinkles, hearts, and hand-written messages. Past cakes include a golf-themed cake, a hand-painted cake for an artist, heart-shaped milestone cakes, holiday cakes with rosemary wreaths and sugared cranberries, and a fresh-fruit genoise with chantilly cream.",
      ],
    },
    {
      heading: "Flavors and finishes",
      paragraphs: [
        "Choose any flavor or combination. Favorites from past orders include red velvet with cream cheese, coconut with raspberry jam, chai with cinnamon buttercream, German chocolate, funfetti, strawberry shortcake, and coffee cake with espresso buttercream.",
        "Finishes include buttercream, ganache drip, or a naked style, with fresh fruit, flowers, sprinkles, and custom toppers.",
      ],
    },
    {
      heading: "For every occasion",
      paragraphs: [
        "Birthdays, baby showers, bridal showers, engagements, graduations, anniversaries, gender reveals, holidays, retirements, or just because — whatever you're celebrating, we'll design a cake to match. Got a wild idea that doesn't fit a category? Tell us; that's our favorite kind of order.",
      ],
    },
  ],
  faqs: [
    { q: "How far in advance should I order a custom cake?", a: "Most custom cakes need at least 2–3 weeks' notice. We occasionally accommodate last-minute orders — reach out and we'll do our best." },
    { q: "How much does a custom cake cost?", a: "Custom cakes start at $115. Pricing depends on size, tiers, and design detail." },
    { q: "Do you deliver in NYC?", a: "Yes. We're based in Midtown East and the Upper East Side and deliver anywhere in New York City. Delivery fees vary by distance, and pickup is also available." },
    { q: "Can you work with allergies or dietary needs?", a: "Let us know about any allergies or dietary needs in your order request and we'll talk through options with you. Our kitchen does handle common allergens." },
    { q: "Can I send inspiration photos?", a: "Yes — the order form lets you upload up to five inspiration photos or paste links from Pinterest or Instagram." },
  ],
  photoMatch: /custom|themed|heart|holiday|vintage|genoise|painter/i,
  galleryHeading: "Recent Custom Cakes",
};

export default async function CustomCakesPage() {
  const photos = await getPublishedPortfolioPhotos();
  return <ServiceLanding content={content} photos={photos} />;
}
