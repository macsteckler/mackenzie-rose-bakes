import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "We could not find that page. Return to Mackenzie Rose Bakes for custom cakes, cupcakes, and treats in New York City.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50 px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🎂</div>
        <h1
          className="text-5xl font-bold text-rose-950 mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Page Not Found
        </h1>
        <p className="text-stone-500 mb-8 max-w-sm mx-auto">
          Oops — looks like this page got eaten! Let&apos;s get you back to
          something sweet.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-7 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Go Home
          </Link>
          <Link
            href="/order"
            className="px-7 py-3 bg-white text-rose-600 font-semibold rounded-full border-2 border-rose-200 hover:border-rose-300 transition-all duration-200"
          >
            Order a Cake
          </Link>
        </div>
      </div>
    </section>
  );
}
