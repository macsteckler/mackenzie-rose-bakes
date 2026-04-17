import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Custom Cake Artist NYC",
  description:
    "Meet Mackenzie, the NYC-based cake artist and baker behind Mackenzie Rose Bakes. Learn her story, her passion for custom cakes, and why New York City loves her creations.",
  openGraph: {
    title: "About | Mackenzie Rose Bakes",
    description:
      "Meet Mackenzie — NYC cake artist, baker, and the heart behind Mackenzie Rose Bakes.",
  },
};

const values = [
  {
    icon: "🌸",
    title: "Made From Scratch",
    desc: "Every cake, every cupcake, every cookie starts with real, quality ingredients. No mixes, no shortcuts.",
  },
  {
    icon: "🎨",
    title: "Design-First",
    desc: "Beautiful and delicious aren't mutually exclusive. Every creation is a work of art you can eat.",
  },
  {
    icon: "💌",
    title: "Personal Touch",
    desc: "Every order gets Mackenzie's personal attention — from your first inquiry to the moment you take that first bite.",
  },
  {
    icon: "🗽",
    title: "NYC Proud",
    desc: "Born and baked in New York City. We love this city and the incredible people in it.",
  },
];


export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-2">
            Our Story
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-rose-950 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Meet{" "}
            <span className="text-rose-500 italic">Mackenzie</span>
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Cake artist, baker, and the heart behind every creation at Mackenzie
            Rose Bakes.
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-3">
            Hi, I&apos;m Mackenzie
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-rose-950 leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Passion Baked Into{" "}
            <span className="text-rose-500 italic">Every Layer</span>
          </h2>
          <div className="space-y-4 text-stone-600 leading-relaxed text-left">
            <p>
              I&apos;ve been baking for as long as I can remember. Growing
              up, the kitchen was my happy place — and New York City was the
              backdrop that inspired my boldest, most colorful creations.
            </p>
            <p>
              What started as baking for friends and family has grown into
              something I never expected — creating custom cakes for all
              kinds of celebrations, right from my home kitchen in the
              city I love. Every order is a collaboration between us — you
              bring the vision, I bring it to life with flour, butter, and
              a whole lot of love.
            </p>
            <p>
              I&apos;m currently attending the{" "}
              <span className="font-semibold text-rose-700">Institute of Culinary Education</span>{" "}
              in New York City, deepening my skills and bringing everything I
              learn straight back into my kitchen and into every cake I make.
            </p>
            <p>
              I believe a cake should be as beautiful as it is delicious.
              That&apos;s why I never compromise on ingredients and I never
              stop learning new techniques. From intricate buttercream
              piping to delicate hand-crafted details, I approach every
              creation as a piece of art.
            </p>
            <p>
              When I&apos;m not in the kitchen, you&apos;ll find me
              exploring NYC&apos;s incredible food scene, sketching design
              ideas in coffee shops, or dreaming up the next wild flavor
              combination to test on willing taste-testers.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/portfolio"
              className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
            >
              See My Work
            </Link>
            <Link
              href="/order"
              className="px-6 py-3 bg-white hover:bg-rose-50 text-rose-600 font-semibold rounded-full border-2 border-rose-200 hover:border-rose-300 transition-all duration-200 text-sm hover:-translate-y-0.5"
            >
              Work With Me
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-rose-50 to-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-2">
              What We Stand For
            </p>
            <h2
              className="text-4xl font-bold text-rose-950"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Our Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-rose-50"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3
                  className="font-bold text-rose-900 mb-2 text-lg"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {value.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3 text-rose-950"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Let&apos;s Create Together
          </h2>
          <p className="text-stone-500 mb-7">
            Ready to turn your vision into something delicious? I&apos;d love to
            hear from you.
          </p>
          <Link
            href="/order"
            className="inline-block px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Request a Custom Order
          </Link>
        </div>
      </section>
    </>
  );
}
