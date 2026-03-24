"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const serviceOptions = [
  "Birthday Cake",
  "Wedding Cake",
  "Cupcakes",
  "Cookie Box",
  "Celebration Cake",
  "Corporate / Bulk Order",
  "Your Vision, Made Real (Custom / Misc)",
  "Other",
];

const budgetRanges = [
  "Under $100",
  "$100 – $200",
  "$200 – $400",
  "$400 – $600",
  "$600+",
  "Not sure yet",
];

type FormState = "idle" | "submitting" | "success" | "error";

export default function OrderForm() {
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    service: "",
    servingSize: "",
    flavors: "",
    design: "",
    dietary: "",
    budget: "",
    hearAbout: "",
    message: "",
  });

  useEffect(() => {
    const service = searchParams.get("service");
    if (service) {
      setFormData((prev) => ({ ...prev, service }));
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormState("success");
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <div className="bg-rose-50 rounded-3xl border border-rose-100 p-12 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2
          className="text-3xl font-bold text-rose-950 mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Order Request Sent!
        </h2>
        <p className="text-stone-600 max-w-sm mx-auto mb-6">
          Thank you so much! Mackenzie will be in touch within 24 hours to
          discuss your order. We can&apos;t wait to bake for you! 🍰
        </p>
        <button
          onClick={() => {
            setFormState("idle");
            setFormData({
              name: "",
              email: "",
              phone: "",
              eventDate: "",
              service: "",
              servingSize: "",
              flavors: "",
              design: "",
              dietary: "",
              budget: "",
              hearAbout: "",
              message: "",
            });
          }}
          className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 space-y-6"
    >
      <h2
        className="text-2xl font-bold text-rose-950"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Order Request Form
      </h2>

      {/* Contact Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-widest">
          Contact Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(212) 555-0123"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Event Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              name="eventDate"
              required
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-widest">
          Order Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Service Type <span className="text-rose-400">*</span>
            </label>
            <select
              name="service"
              required
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm bg-white"
            >
              <option value="" disabled>
                Select a service...
              </option>
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Approximate Serving Size
            </label>
            <input
              type="text"
              name="servingSize"
              value={formData.servingSize}
              onChange={handleChange}
              placeholder="e.g. 20 guests, 2 dozen cupcakes"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Flavor(s) You&apos;re Thinking Of
          </label>
          <input
            type="text"
            name="flavors"
            value={formData.flavors}
            onChange={handleChange}
            placeholder="e.g. vanilla bean cake, strawberry buttercream, chocolate ganache"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Design Ideas / Theme <span className="text-rose-400">*</span>
          </label>
          <textarea
            name="design"
            required
            rows={3}
            value={formData.design}
            onChange={handleChange}
            placeholder="Describe your vision — colors, themes, inspiration photos, style (modern, rustic, whimsical, etc.)"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300 resize-none"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Dietary Restrictions / Allergies
            </label>
            <input
              type="text"
              name="dietary"
              value={formData.dietary}
              onChange={handleChange}
              placeholder="e.g. gluten-free, dairy-free, nut allergy"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Budget Range
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm bg-white"
            >
              <option value="">Select a range...</option>
              {budgetRanges.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Additional */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-widest">
          Anything Else?
        </h3>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Additional Notes or Questions
          </label>
          <textarea
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="Anything else we should know? Delivery address, special requests, reference photos links, etc."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            How Did You Hear About Us?
          </label>
          <input
            type="text"
            name="hearAbout"
            value={formData.hearAbout}
            onChange={handleChange}
            placeholder="Google, Instagram, word of mouth, etc."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm placeholder:text-stone-300"
          />
        </div>
      </div>

      {formState === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              Something went wrong submitting your request. Please try again or reach out directly.
        </div>
      )}

      <button
        type="submit"
        disabled={formState === "submitting"}
        className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold text-base rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {formState === "submitting" ? "Sending..." : "Send My Order Request 🎂"}
      </button>
      <p className="text-center text-xs text-stone-400">
        We&apos;ll get back to you within 24 hours · No payment required yet
      </p>
    </form>
  );
}
