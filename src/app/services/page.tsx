import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — Custom Cakes, Cupcakes & More NYC",
  description:
    "Explore our full range of custom baked goods in New York City: birthday cakes, wedding cakes, cupcakes, decorated cookies, and corporate orders. Starting prices included.",
  openGraph: {
    title: "Services | Mackenzie Rose Bakes",
    description:
      "Custom cakes, cupcakes, cookies & more — handcrafted in New York City.",
  },
};

const services = [
  {
    id: "birthday-cakes",
    icon: "🎂",
    title: "Birthday Cakes",
    tagline: "The centerpiece of every celebration",
    description:
      "Completely custom birthday cakes designed around your vision. From whimsical and colorful to sleek and elegant, every cake is built from scratch with scratch-made buttercream, fillings, and fondant details.",
    features: [
      "Any flavor or flavor combination",
      "Custom colors & themes",
      "1–6 tiers available",
      "Fondant, buttercream, or naked finish",
      "Dietary accommodations available",
    ],
    startingPrice: "$115",
    color: "rose",
  },
  {
    id: "wedding-cakes",
    icon: "💒",
    title: "Wedding Cakes",
    tagline: "The sweetest part of your big day",
    description:
      "Your wedding cake should be as breathtaking as your dress. We work closely with you to design a cake that reflects your wedding aesthetic — whether it's romantic florals, modern minimalism, or bold maximalism.",
    features: [
      "Complimentary tasting consultation",
      "Custom floral & fondant detail work",
      "Tiered designs for any guest count",
      "Cutting & dessert cake options",
      "NYC delivery & setup available",
    ],
    startingPrice: "$300",
    color: "pink",
  },
  {
    id: "cupcakes",
    icon: "🧁",
    title: "Cupcakes",
    tagline: "Individual perfection in every bite",
    description:
      "Beautifully decorated cupcakes in any flavor and theme. Perfect for events, parties, showers, or as a complement to a larger cake. Available in standard and mini sizes.",
    features: [
      "Sold in dozens (min. 12)",
      "Mix-and-match flavors",
      "Custom toppers & wraps",
      "Mini cupcake option",
      "Ideal for office events & showers",
    ],
    startingPrice: "$45 / dozen",
    color: "amber",
  },
  {
    id: "cookie-boxes",
    icon: "🍪",
    title: "Cookie Boxes",
    tagline: "Adorable, delicious, giftable",
    description:
      "Decorated royal icing sugar cookies crafted to any shape, theme, or color palette. Beautifully boxed and perfect as party favors, gifts, or sweet table additions.",
    features: [
      "Custom shapes cut to order",
      "Royal icing or buttercream",
      "Individual cello bags available",
      "Gift-ready packaging",
      "Corporate branding options",
    ],
    startingPrice: "$36 / dozen",
    color: "emerald",
  },
  {
    id: "celebration-cakes",
    icon: "🎉",
    title: "Celebration Cakes",
    tagline: "Every milestone deserves a cake",
    description:
      "Baby showers, bridal showers, graduations, anniversaries, gender reveals — whatever the occasion, we design a cake that makes it unforgettable.",
    features: [
      "Gender reveal cakes",
      "Baby & bridal shower cakes",
      "Graduation cakes",
      "Anniversary cakes",
      "Retirement & milestone cakes",
    ],
    startingPrice: "$115",
    color: "purple",
  },
  {
    id: "custom-vision",
    icon: "✨",
    title: "Your Vision, Made Real",
    tagline: "No idea too bold, no dream too sweet",
    description:
      "Have something totally unique in mind that doesn't fit a category? Tell us your vision — no matter how wild, intricate, or completely out-of-the-box — and we'll figure out how to bring it to delicious life. This is the spot for anything and everything miscellaneous.",
    features: [
      "You describe it, we create it",
      "Completely one-of-a-kind design",
      "Free consultation to explore your idea",
      "Great for themed events & unique gifts",
      "No concept too creative to try",
    ],
    startingPrice: "Custom quote",
    color: "pink",
  },
  {
    id: "corporate",
    icon: "🏢",
    title: "Corporate & Bulk Orders",
    tagline: "Branded treats for your team & events",
    description:
      "Impress clients and celebrate your team with custom branded cakes, cookie boxes, and cupcake sets. Great for product launches, holiday parties, and company milestones.",
    features: [
      "Logo-printed cookie boxes",
      "Branded cakes & cupcakes",
      "Bulk discounts available",
      "NYC corporate delivery",
      "Recurring order setups",
    ],
    startingPrice: "Contact for quote",
    color: "slate",
  },
];

const colorMap: Record<string, { bg: string; border: string; badge: string; icon: string }> = {
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-100",
    badge: "bg-rose-100 text-rose-700",
    icon: "bg-rose-100",
  },
  pink: {
    bg: "bg-pink-50",
    border: "border-pink-100",
    badge: "bg-pink-100 text-pink-700",
    icon: "bg-pink-100",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-100",
    badge: "bg-amber-100 text-amber-700",
    icon: "bg-amber-100",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    badge: "bg-emerald-100 text-emerald-700",
    icon: "bg-emerald-100",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-100",
    badge: "bg-purple-100 text-purple-700",
    icon: "bg-purple-100",
  },
  slate: {
    bg: "bg-slate-50",
    border: "border-slate-100",
    badge: "bg-slate-100 text-slate-700",
    icon: "bg-slate-100",
  },
};

const faqs = [
  {
    q: "How far in advance should I order?",
    a: "We recommend placing orders at least 2–3 weeks in advance for most cakes, and 4–6 weeks for wedding cakes. We do occasionally accommodate last-minute orders — reach out and we'll do our best!",
  },
  {
    q: "Do you offer tastings?",
    a: "Yes! Wedding cake clients receive a complimentary tasting consultation. For other orders, tasting boxes can be arranged for a small fee.",
  },
  {
    q: "Can you accommodate dietary restrictions?",
    a: "Absolutely. We offer gluten-free, dairy-free, and egg-free options. Please note our kitchen does handle common allergens — always let us know about your specific needs.",
  },
  {
    q: "Do you deliver?",
    a: "Yes, we offer delivery within New York City and select surrounding areas. Delivery fees vary by distance. Pickup is also available.",
  },
  {
    q: "What's your payment policy?",
    a: "A 50% non-refundable deposit is due at booking to secure your date. The remaining balance is due one week before your event.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-2">
            Services
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-rose-950 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What We{" "}
            <span className="text-rose-500 italic">Offer</span>
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Every item is made to order, from scratch, with real ingredients —
            no mixes, no shortcuts. Just delicious, beautiful baked goods.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => {
              const colors = colorMap[service.color] ?? colorMap.rose;
              return (
                <article
                  key={service.id}
                  id={service.id}
                  className={`rounded-3xl p-8 border ${colors.bg} ${colors.border} scroll-mt-24`}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={`${colors.icon} rounded-2xl p-4 text-3xl flex-shrink-0`}
                    >
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h2
                          className="text-2xl font-bold text-rose-950"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {service.title}
                        </h2>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}
                        >
                          From {service.startingPrice}
                        </span>
                      </div>
                      <p className="text-stone-500 text-sm italic mb-3">
                        {service.tagline}
                      </p>
                      <p className="text-stone-600 text-sm leading-relaxed mb-5">
                        {service.description}
                      </p>
                      <ul className="space-y-1.5 mb-6">
                        {service.features.map((feat) => (
                          <li
                            key={feat}
                            className="flex items-center gap-2 text-sm text-stone-600"
                          >
                            <span className="text-rose-400 font-bold">✓</span>
                            {feat}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/order?service=${encodeURIComponent(service.title)}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                      >
                        Order {service.title}
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-rose-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-2">
              How It Works
            </p>
            <h2
              className="text-4xl font-bold text-rose-950"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              The Ordering Process
            </h2>
          </div>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Submit a Request",
                desc: "Fill out our order form with your date, design ideas, and flavor preferences.",
              },
              {
                step: "02",
                title: "We Connect",
                desc: "We'll follow up within 24 hours to discuss details and confirm availability.",
              },
              {
                step: "03",
                title: "Secure Your Date",
                desc: "A 50% deposit holds your spot and kicks off the creative process.",
              },
              {
                step: "04",
                title: "Enjoy!",
                desc: "Pick up or receive your custom creation, fresh and ready for your celebration.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-rose-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3
                  className="font-bold text-rose-900 mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {item.title}
                </h3>
                <p className="text-stone-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-16 md:py-24 bg-white scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-2">
              FAQs
            </p>
            <h2
              className="text-4xl font-bold text-rose-950"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-5">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-rose-50 rounded-2xl p-6 border border-rose-100"
              >
                <h3
                  className="font-bold text-rose-900 mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {faq.q}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ready to Order?
          </h2>
          <p className="text-rose-100 mb-7">
            Slots fill up fast — especially for weekends and holidays.
          </p>
          <Link
            href="/order"
            className="inline-block px-8 py-3.5 bg-white text-rose-600 font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Request a Custom Order
          </Link>
        </div>
      </section>
    </>
  );
}
