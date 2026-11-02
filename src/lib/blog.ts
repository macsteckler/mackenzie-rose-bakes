/**
 * Blog posts. These pages are intentionally not linked from the nav or
 * footer — they're discovered by search engines through the sitemap.
 * To add a post, append an entry; the route, sitemap, and structured data
 * are generated from this list.
 */
export type BlogPost = {
  slug: string;
  title: string;
  /** Meta description — keep under ~155 characters. */
  description: string;
  /** ISO date (YYYY-MM-DD). */
  published: string;
  updated?: string;
  intro: string[];
  sections: { heading: string; paragraphs?: string[]; list?: string[] }[];
  faqs: { q: string; a: string }[];
  /** Portfolio photos whose description matches are shown in the article. */
  photoMatch: RegExp;
  /** Where the closing call-to-action points. */
  cta: { label: string; href: string };
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "custom-birthday-cakes-nyc",
    title: "Custom Birthday Cakes in NYC: How to Order the Perfect Cake",
    description:
      "A New York City baker's guide to ordering a custom birthday cake — timing, pricing, sizes, flavor and design ideas, and delivery across all five boroughs.",
    published: "2026-11-01",
    intro: [
      "A birthday cake is usually the centerpiece of the party — the moment everyone gathers, sings, and pulls out their phones. If you're planning a celebration in New York City and want something more personal than a bakery-case cake, a custom birthday cake is the way to go.",
      "I'm Mackenzie, a cake artist based in Midtown East and the Upper East Side. Here's everything I tell clients about ordering a custom birthday cake in NYC, from how far ahead to book to how to pick flavors and a design you'll love.",
    ],
    sections: [
      {
        heading: "How far in advance should you order?",
        paragraphs: [
          "For most custom birthday cakes, plan on at least 2–3 weeks' notice. That leaves time to talk through your design, confirm flavors, and lock in your date. Weekends and holiday periods book up first, so earlier is always better.",
          "Need something sooner? Last-minute orders are sometimes possible — reach out and ask. The worst answer is a friendly no.",
        ],
      },
      {
        heading: "How much does a custom birthday cake cost in NYC?",
        paragraphs: [
          "Custom birthday cakes from Mackenzie Rose Bakes start at $115. The final price depends on three things: size (how many people you're feeding), the number of tiers, and how detailed the design is. A simple single-tier cake with piped lettering will cost less than a multi-tier cake with hand-piped florals and custom toppers.",
          "When you submit an order request, you can choose a budget range so we can design something that fits it.",
        ],
      },
      {
        heading: "Choosing the right size",
        paragraphs: [
          "Start with your guest count. As one example, a 6-inch, two-tier cake serves about 8 people — perfect for an intimate dinner or a small group of friends. For bigger parties, we can go up in diameter or add tiers (we make cakes from one to six tiers).",
          "Just tell us roughly how many guests you're expecting on the order form and we'll recommend a size.",
        ],
      },
      {
        heading: "Birthday cake flavor ideas",
        paragraphs: [
          "Every cake is made from scratch, and you can choose any flavor or combination. A few favorites from recent birthday orders:",
        ],
        list: [
          "Red velvet with cream cheese filling",
          "Chocolate cake with chocolate ganache and chocolate Swiss meringue buttercream",
          "Chocolate with raspberry jam and Swiss meringue buttercream",
          "White chocolate cake filled with fresh strawberries",
          "Berry chantilly with whipped cream",
          "Coconut cake with white buttercream",
          "Funfetti — always a crowd-pleaser",
        ],
      },
      {
        heading: "Birthday cake design ideas we love",
        paragraphs: [
          "The best designs usually start with something personal — a favorite color, a hobby, or a milestone. Some recent birthday cakes for inspiration:",
        ],
        list: [
          "Vintage-style piped cakes with ruffled borders, bows, and pearl sprinkles",
          "Heart-shaped cakes with vintage piping and candy jewels",
          "Milestone cakes — lots of 25th birthdays with piped numbers and spiral candles",
          "Themed cakes, like a golf cake with buttercream grass, a sand trap, and \"It's Par-Tee Time\" lettering",
          "Artist-inspired cakes with a hand-painted design",
          "Bold and moody — a matte black cake with gold writing",
          "Party-ready colors with hot pink and orange ruffles and mini disco ball toppers",
        ],
      },
      {
        heading: "Pickup and delivery across NYC",
        paragraphs: [
          "We're based in Midtown East and the Upper East Side and deliver birthday cakes anywhere in New York City — Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. Delivery fees vary by distance, and pickup is also available.",
        ],
      },
      {
        heading: "How to order your custom birthday cake",
        list: [
          "Fill out the order request form with your date, guest count, flavors, and design ideas.",
          "Upload up to five inspiration photos or paste links from Pinterest or Instagram.",
          "Hear back within 24 hours to talk through details and confirm availability.",
          "Secure your date with a 50% deposit — the balance is due one week before your event.",
          "Pick up your cake or have it delivered, and enjoy the party.",
        ],
      },
    ],
    faqs: [
      {
        q: "How far in advance should I order a custom birthday cake in NYC?",
        a: "Plan on at least 2–3 weeks' notice for most custom birthday cakes. Last-minute orders are sometimes possible, so it's always worth asking.",
      },
      {
        q: "How much does a custom birthday cake cost?",
        a: "Custom birthday cakes from Mackenzie Rose Bakes start at $115. Pricing depends on size, number of tiers, and design detail.",
      },
      {
        q: "Do you deliver birthday cakes in NYC?",
        a: "Yes — we deliver anywhere in New York City, including Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. Pickup is also available.",
      },
      {
        q: "Can I send a photo of a cake I like?",
        a: "Yes. The order form lets you upload up to five inspiration photos or share links from Pinterest or Instagram.",
      },
    ],
    photoMatch: /birthday/i,
    cta: { label: "Request Your Birthday Cake", href: "/order?service=Birthday%20Cake" },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
