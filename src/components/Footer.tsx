import Link from "next/link";

const footerLinks = [
  {
    heading: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/services", label: "Services" },
      { href: "/about", label: "About" },
    ],
  },
  {
    heading: "Order",
    links: [
      { href: "/order", label: "Request a Custom Order" },
      { href: "/services#faq", label: "FAQs" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-rose-950 text-rose-100">
      {/* Top wave */}
      <div className="bg-white leading-none" style={{ lineHeight: 0, fontSize: 0 }}>
        <svg
          viewBox="0 0 1440 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
          style={{ height: "72px" }}
        >
          <path
            d="M0,0 C480,72 960,72 1440,0 L1440,72 L0,72 Z"
            fill="#4c0519"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex flex-col leading-tight mb-4">
              <span
                className="text-2xl font-bold text-white tracking-wide"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Mackenzie Rose
              </span>
              <span className="text-amber-400 text-sm font-medium tracking-[0.2em] uppercase">
                Bakes
              </span>
            </Link>
            <p className="text-rose-200/80 text-sm leading-relaxed max-w-xs mt-3">
              Handcrafted custom cakes and baked goods for life&apos;s sweetest
              moments. Proudly serving New York City and surrounding areas.
            </p>
            <p className="text-rose-300/60 text-xs mt-4">
              📍 New York City, NY
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.heading}>
              <h4
                className="text-white text-sm font-semibold uppercase tracking-widest mb-4"
              >
                {group.heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-rose-200/70 hover:text-amber-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-rose-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-rose-300/50 text-xs">
            © {new Date().getFullYear()} Mackenzie Rose Bakes. All rights
            reserved.
          </p>
          <p className="text-rose-300/50 text-xs">
            Custom cakes & baked goods · New York City
          </p>
        </div>
      </div>
    </footer>
  );
}
