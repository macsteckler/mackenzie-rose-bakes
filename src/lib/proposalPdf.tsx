import fs from "node:fs";
import path from "node:path";
import React from "react";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

const PROPOSAL_LOGO_SRC = `data:image/png;base64,${fs
  .readFileSync(
    path.join(process.cwd(), "public", "mackenzielogotransparent.png")
  )
  .toString("base64")}`;

export type ProposalOrderInput = {
  name?: string;
  email?: string;
  phone?: string;
  eventDate?: string;
  service?: string;
  servingSize?: string;
  flavors?: string;
  design?: string;
  dietary?: string;
  budget?: string;
  hearAbout?: string;
  message?: string;
};

type ServicePdfBlock = {
  startingPrice: string;
  features: string[];
  extraNote?: string;
};

/** Matches options in `@/components/OrderForm.tsx` plus sane fallbacks. */
const SERVICE_BLOCKS: Record<string, ServicePdfBlock> = {
  "Birthday Cake": {
    startingPrice: "$115",
    features: [
      "Any flavor or flavor combination",
      "Custom colors & themes",
      "1–6 tiers available",
      "Buttercream, ganache drip, or naked finishes",
      "Dietary accommodations available",
    ],
  },
  "Wedding Cake": {
    startingPrice: "$300",
    extraNote:
      "Wedding inquiries include complimentary tasting consultation when you book; we’ll confirm tasting details as we refine your design.",
    features: [
      "Complimentary tasting consultation",
      "Custom floral piping & intricate buttercream detail work",
      "Tiered designs for any guest count",
      "Cutting & dessert cake options",
      "NYC delivery & setup available",
    ],
  },
  Cupcakes: {
    startingPrice: "$45 / dozen",
    features: [
      "Sold in dozens (min. 12)",
      "Mix-and-match flavors",
      "Custom toppers & wraps",
      "Mini cupcake option available",
      "Ideal for office events & showers",
    ],
  },
  "Custom Cookie Assortment": {
    startingPrice: "$36 / dozen",
    features: [
      "Custom flavor and color palettes",
      "Mix-and-match variety",
      "Individual cello bags available",
      "Gift-ready packaging",
      "Corporate branding options",
    ],
  },
  "Celebration Cake": {
    startingPrice: "$115",
    features: [
      "Baby & bridal showers, graduations",
      "Gender reveals and milestone events",
      "Anniversary and retirement celebrations",
      "Design tailored to your occasion",
      "Serving NYC and surrounding areas",
    ],
  },
  "Corporate / Bulk Order": {
    startingPrice: "Contact for quote",
    extraNote:
      "Corporate and bulk orders can include branded cookies, cupcakes, and cakes — we’ll align packaging and logo use with your guidelines.",
    features: [
      "Branded cookie assortments & cupcakes",
      "Bulk discounts where applicable",
      "NYC corporate delivery",
      "Recurring order setups available",
    ],
  },
  "Your Vision, Made Real (Custom / Misc)": {
    startingPrice: "Custom quote",
    features: [
      "One-of-a-kind design from your description",
      "Consultation to explore your idea",
      "Themed events & unique gifts",
      "No concept too creative to discuss",
    ],
  },
  Other: {
    startingPrice: "Custom quote",
    features: [
      "We’ll review your request and follow up with tailored options",
      "Final pricing depends on scope, servings, and design",
    ],
  },
};

const DEFAULT_BLOCK: ServicePdfBlock = SERVICE_BLOCKS["Other"];

/** Align prefilled URLs from `/services` with `OrderForm` option strings. */
function resolveServiceKey(service?: string): string {
  const s = service?.trim() ?? "";
  const aliases: Record<string, string> = {
    "Birthday Cakes": "Birthday Cake",
    "Wedding Cakes": "Wedding Cake",
    "Celebration Cakes": "Celebration Cake",
    "Corporate & Bulk Orders": "Corporate / Bulk Order",
    "Corporate & Bulk Order": "Corporate / Bulk Order",
  };
  return aliases[s] ?? s;
}

function getBlockForService(service?: string): ServicePdfBlock {
  const key = resolveServiceKey(service);
  if (key !== "" && key in SERVICE_BLOCKS) {
    return SERVICE_BLOCKS[key];
  }
  return DEFAULT_BLOCK;
}

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    color: "#1c1917",
    padding: 42,
    paddingBottom: 48,
  },
  tagline: {
    fontSize: 10,
    color: "#57534e",
    lineHeight: 1.5,
    marginBottom: 20,
    marginTop: 2,
  },
  heading: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#9f1239",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 14,
  },
  labelRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 110,
    color: "#57534e",
  },
  value: {
    flex: 1,
    color: "#1c1917",
  },
  box: {
    borderLeftWidth: 3,
    borderLeftColor: "#fda4af",
    backgroundColor: "#fff8f0",
    padding: 12,
    marginTop: 4,
  },
  boxAlt: {
    borderLeftWidth: 3,
    borderLeftColor: "#fcd34d",
    backgroundColor: "#fffdf5",
    padding: 12,
    marginTop: 4,
  },
  bullets: {
    marginTop: 6,
    marginBottom: 4,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 4,
  },
  bulletChar: {
    width: 12,
    color: "#e11d48",
    fontFamily: "Helvetica-Bold",
  },
  priceBadge: {
    marginTop: 6,
    fontSize: 9,
    color: "#57534e",
  },
  terms: {
    marginTop: 8,
    fontSize: 9,
    color: "#57534e",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 42,
    right: 42,
    fontSize: 8,
    color: "#78716c",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#fecdd3",
    paddingTop: 10,
  },
});

function ProposalPdfDocument(
  props: ProposalOrderInput & { logoSrc: string }
) {
  const { logoSrc } = props;
  const service = props.service ?? "Order inquiry";
  const block = getBlockForService(props.service);
  const proposalDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Image
          src={logoSrc}
          style={{ width: 120, height: 60, marginBottom: 4, objectFit: "contain" }}
        />
        <Text style={styles.tagline}>
          Custom cakes & baked goods — New York City
        </Text>
        <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 6 }}>
          Order Proposal
        </Text>
        <Text style={{ fontSize: 9, color: "#78716c", marginBottom: 14 }}>
          Prepared {proposalDate} · Inquiry from mackenzierosebakes.com
        </Text>

        <Text style={styles.heading}>Client information</Text>
        <View>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{props.name ?? "—"}</Text>
          </View>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{props.email ?? "—"}</Text>
          </View>
          {props.phone ? (
            <View style={styles.labelRow}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{props.phone}</Text>
            </View>
          ) : null}
          <View style={styles.labelRow}>
            <Text style={styles.label}>Event date</Text>
            <Text style={styles.value}>{props.eventDate ?? "—"}</Text>
          </View>
        </View>

        <Text style={styles.heading}>Order summary</Text>
        <View>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Service</Text>
            <Text style={styles.value}>{service}</Text>
          </View>
          {props.servingSize ? (
            <View style={styles.labelRow}>
              <Text style={styles.label}>Serving size</Text>
              <Text style={styles.value}>{props.servingSize}</Text>
            </View>
          ) : null}
          {props.flavors ? (
            <View style={styles.labelRow}>
              <Text style={styles.label}>Flavor(s)</Text>
              <Text style={styles.value}>{props.flavors}</Text>
            </View>
          ) : null}
          {props.budget ? (
            <View style={styles.labelRow}>
              <Text style={styles.label}>Budget range</Text>
              <Text style={styles.value}>{props.budget}</Text>
            </View>
          ) : null}
          <Text style={styles.priceBadge}>
            Starting points for this category: from {block.startingPrice}; final pricing is custom to your scope and confirmed after consultation.
          </Text>
        </View>

        <Text style={styles.heading}>{service}: what we offer</Text>
        {block.extraNote ? (
          <View style={[styles.box, { borderLeftColor: "#f472b6" }]}>
            <Text style={{ fontSize: 9, lineHeight: 1.5 }}>{block.extraNote}</Text>
          </View>
        ) : null}
        <View style={styles.bullets}>
          {block.features.map((feat) => (
            <View key={feat} style={styles.bullet} wrap={false}>
              <Text style={styles.bulletChar}>•</Text>
              <Text style={{ flex: 1 }}>{feat}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.heading}>Design vision</Text>
        <View style={styles.box}>
          <Text style={{ fontSize: 10, lineHeight: 1.55 }}>
            {props.design ?? ""}
          </Text>
        </View>

        {props.dietary ? (
          <>
            <Text style={styles.heading}>Dietary & allergies</Text>
            <View style={styles.box}>
              <Text style={{ fontSize: 10, lineHeight: 1.55 }}>{props.dietary}</Text>
            </View>
          </>
        ) : null}

        {props.message ? (
          <>
            <Text style={styles.heading}>Additional notes</Text>
            <View style={styles.boxAlt}>
              <Text style={{ fontSize: 10, lineHeight: 1.55 }}>{props.message}</Text>
            </View>
          </>
        ) : null}

        {props.hearAbout ? (
          <Text style={{ fontSize: 8, color: "#a8a29e", marginTop: 8 }}>
            Referral source: {props.hearAbout}
          </Text>
        ) : null}

        <Text style={styles.heading}>Terms & next steps</Text>
        <Text style={styles.terms}>
          This proposal summarizes your inquiry. A 50% non-refundable deposit secures your date after we confirm availability and details. Most custom orders require 2–3 weeks' notice; wedding cakes often need 4–6 weeks.
          {"\n\n"}
          We serve New York City and surrounding areas — delivery or pickup arrangements are finalized when your order is booked. Reply anytime to refine flavors, servings, or design — we're here to bring your celebration to life.
        </Text>

        <View style={styles.footer} fixed>
          <Text>
            Mackenzie Rose Bakes · www.mackenzierosebakes.com · NYC & surrounding areas
          </Text>
        </View>
      </Page>
    </Document>
  );
}

/** Build a sanitized filename fragment for Storage (alphanumeric segments). */
export function sanitizeFilenamePart(part: string, maxLen: number): string {
  const cleaned = String(part)
    .replace(/[^a-zA-Z0-9]+/g, "")
    .slice(0, maxLen);
  return cleaned || "Guest";
}

export function buildProposalPdfFilename(order: ProposalOrderInput): string {
  const rawDate = order.eventDate?.trim() || new Date().toISOString().slice(0, 10);
  const datePart = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : new Date().toISOString().slice(0, 10);
  const namePart = sanitizeFilenamePart(order.name ?? "Guest", 32);
  const servicePart = sanitizeFilenamePart(order.service ?? "Order", 40);
  return `${datePart}_${namePart}_${servicePart}_${Date.now()}.pdf`;
}

export async function buildProposalPdfBuffer(
  order: ProposalOrderInput
): Promise<Buffer> {
  return renderToBuffer(
    <ProposalPdfDocument logoSrc={PROPOSAL_LOGO_SRC} {...order} />
  );
}
