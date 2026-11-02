import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GA_MEASUREMENT_ID, SITE_NAME, SITE_URL } from "@/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Mackenzie Rose Bakes | Custom Cakes NYC",
    template: "%s | Mackenzie Rose Bakes",
  },
  description:
    "Custom cakes, cupcakes, and baked goods handcrafted in New York City. Specializing in birthday cakes, wedding cakes, and celebration treats, delivered anywhere in NYC.",
  keywords: [
    "custom cakes NYC",
    "New York City bakery",
    "birthday cakes Manhattan",
    "wedding cakes New York",
    "custom cupcakes NYC",
    "celebration cakes Brooklyn",
    "bespoke cakes New York",
    "custom cake delivery NYC",
    "cake designer New York",
  ],
  authors: [{ name: "Mackenzie Rose Bakes" }],
  creator: "Mackenzie Rose Bakes",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  // Always the canonical domain — VERCEL_URL is a per-deployment hostname,
  // which would make shared link previews point at throwaway URLs.
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "Mackenzie Rose Bakes | Custom Cakes NYC",
    description:
      "Custom cakes, cupcakes, and baked goods handcrafted in New York City.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mackenzie Rose Bakes | Custom Cakes NYC",
    description:
      "Custom cakes, cupcakes, and baked goods handcrafted in New York City.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// GA4 only loads on the live production deployment so local dev and Vercel
// preview deployments don't pollute analytics.
const loadAnalytics = process.env.VERCEL_ENV === "production";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#bakery` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
      {loadAnalytics && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
