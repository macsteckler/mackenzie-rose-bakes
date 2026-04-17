import type { Metadata } from "next";
import { Suspense } from "react";
import OrderForm from "@/components/OrderForm";

export const metadata: Metadata = {
  title: "Request a Custom Order — NYC Custom Cakes",
  description:
    "Request a custom cake or baked goods order from Mackenzie Rose Bakes in New York City. Fill out our order form and we'll be in touch within 24 hours.",
  openGraph: {
    title: "Order | Mackenzie Rose Bakes",
    description:
      "Request a custom cake or baked goods in New York City. We'll be in touch within 24 hours.",
  },
};

export default function OrderPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-2">
            Custom Orders
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-rose-950 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Let&apos;s Create Something{" "}
            <span className="text-rose-500 italic">Sweet</span>
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Fill out the form below and we&apos;ll get back to you within 24
            hours to discuss your order. We can&apos;t wait to bring your vision
            to life!
          </p>
        </div>
      </section>

      {/* Form + Side Info */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Side Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                <h3
                  className="font-bold text-rose-900 text-lg mb-4"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Before You Order
                </h3>
                <ul className="space-y-3 text-sm text-stone-600">
                  {[
                    "Orders require at least 2–3 weeks notice (4–6 for weddings)",
                    "A 50% deposit secures your date",
                    "We'll confirm availability before collecting payment",
                    "Dietary needs? Just let us know in the notes field",
                    "We serve NYC and surrounding areas",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-rose-400 font-bold mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <div className="text-3xl mb-2">💌</div>
                <h3
                  className="font-bold text-amber-900 mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  We Reply Within 24 Hours
                </h3>
                <p className="text-stone-600 text-sm">
                  Once you submit your request, Mackenzie will personally reach
                  out to discuss details and confirm your order.
                </p>
              </div>

              <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100">
                <h3
                  className="font-bold text-pink-900 mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Popular This Season
                </h3>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li>🎂 Custom Birthday Cakes — from $115</li>
                  <li>💒 Wedding Cakes — from $300</li>
                  <li>🧁 Cupcake Dozens — from $45</li>
                  <li>🍪 Custom Cookie Assortment — from $36</li>
                </ul>
              </div>
            </div>

            {/* Order Form */}
            <div className="lg:col-span-2">
              <Suspense fallback={<div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 animate-pulse h-96" />}>
                <OrderForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
