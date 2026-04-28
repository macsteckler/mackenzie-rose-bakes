import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

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
    "Custom cakes, cupcakes, and baked goods handcrafted in New York City. Specializing in birthday cakes, wedding cakes, and celebration treats for NYC and surrounding areas.",
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
  // Uses the live Vercel URL automatically; falls back to custom domain once connected
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://www.mackenzierosebakes.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mackenzie Rose Bakes",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
