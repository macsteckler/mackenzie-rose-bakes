import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import {
  buildProposalPdfBuffer,
  buildProposalPdfFilename,
  type ProposalOrderInput,
} from "@/lib/proposalPdf";
import {
  uploadProposalPdf,
  recordOrderSubmission,
  getInspirationPhotoSignedUrl,
  type InspirationPhotoRecord,
} from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.ORDER_EMAIL ?? "";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_INSPIRATION_LINKS = 5;
const MAX_INSPIRATION_PHOTOS = 5;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type OrderRequestBody = ProposalOrderInput & {
  honeypot?: string;
  submissionId?: string;
  inspirationLinks?: string[];
  inspirationPhotos?: InspirationPhotoRecord[];
};

/** Trims, filters, dedupes, and caps customer-supplied inspiration links. */
function sanitizeInspirationLinks(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const links: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim().slice(0, 500);
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    links.push(trimmed);
    if (links.length >= MAX_INSPIRATION_LINKS) break;
  }
  return links;
}

function sanitizeInspirationPhotos(
  raw: unknown,
  submissionId: string | undefined
): InspirationPhotoRecord[] {
  if (!Array.isArray(raw) || !submissionId) return [];
  const photos: InspirationPhotoRecord[] = [];
  for (const item of raw) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof (item as { path?: unknown }).path !== "string"
    ) {
      continue;
    }
    const candidate = item as InspirationPhotoRecord;
    // Defense in depth: only accept paths scoped to this submission. The
    // Supabase layer re-verifies existence/ownership before persisting.
    if (!candidate.path.startsWith(`${submissionId}/`)) continue;
    photos.push({
      path: candidate.path,
      originalFilename:
        typeof candidate.originalFilename === "string"
          ? candidate.originalFilename.slice(0, 200)
          : undefined,
      contentType:
        typeof candidate.contentType === "string"
          ? candidate.contentType
          : undefined,
      size: typeof candidate.size === "number" ? candidate.size : undefined,
    });
    if (photos.length >= MAX_INSPIRATION_PHOTOS) break;
  }
  return photos;
}

export async function POST(request: NextRequest) {
  if (!process.env.RESEND_API_KEY || !TO_EMAIL) {
    return NextResponse.json(
      { error: "Email service not configured." },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as OrderRequestBody;

    // Silent honeypot: bots that fill hidden fields get a fake success
    // response instead of a signal that they were detected.
    if (typeof body.honeypot === "string" && body.honeypot.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    const {
      name,
      email,
      phone,
      eventDate,
      service,
      servingSize,
      flavors,
      design,
      dietary,
      budget,
      hearAbout,
      message,
    } = body;

    const submissionId =
      typeof body.submissionId === "string" && UUID_RE.test(body.submissionId)
        ? body.submissionId
        : undefined;
    const inspirationLinks = sanitizeInspirationLinks(body.inspirationLinks);
    const inspirationPhotos = sanitizeInspirationPhotos(
      body.inspirationPhotos,
      submissionId
    );

    const emailRaw = String(email ?? "");
    const n = escapeHtml(String(name ?? ""));
    const em = escapeHtml(emailRaw);
    const ph = phone ? escapeHtml(String(phone)) : "";
    const ev = escapeHtml(String(eventDate ?? ""));
    const sv = escapeHtml(String(service ?? ""));
    const ss = servingSize ? escapeHtml(String(servingSize)) : "";
    const fl = flavors ? escapeHtml(String(flavors)) : "";
    const dg = escapeHtml(String(design ?? ""));
    const dt = dietary ? escapeHtml(String(dietary)) : "";
    const bud = budget ? escapeHtml(String(budget)) : "";
    const ha = hearAbout ? escapeHtml(String(hearAbout)) : "";
    const msg = message ? escapeHtml(String(message)) : "";

    // Persist the submission (and confirm the inspiration uploads really
    // exist and belong to this submission) before emailing.
    const saved = await recordOrderSubmission(
      {
        submissionId,
        name,
        email,
        phone,
        eventDate,
        service,
        servingSize,
        flavors,
        design,
        dietary,
        budget,
        hearAbout,
        message,
        inspirationLinks,
      },
      inspirationPhotos
    );
    if (!saved.ok) {
      console.warn("[Order] Failed to persist submission:", saved.error);
    }

    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await buildProposalPdfBuffer({
        ...body,
        inspirationLinks,
        inspirationPhotoCount: inspirationPhotos.length,
      });
    } catch (pdfErr) {
      console.error("[Order] PDF generation failed:", pdfErr);
    }

    if (pdfBuffer) {
      const filename = buildProposalPdfFilename(body);
      const uploaded = await uploadProposalPdf(pdfBuffer, filename);
      if (!uploaded.ok && uploaded.error) {
        console.warn("[Order] Proposal upload:", uploaded.error);
      }
    }

    // Best-effort short-lived links so staff can open inspiration photos
    // straight from the notification email.
    const inspirationPhotoLinks = (
      await Promise.all(
        inspirationPhotos.map(async (photo) => {
          const url = await getInspirationPhotoSignedUrl(photo.path);
          return url
            ? { url, label: photo.originalFilename || "Inspiration photo" }
            : null;
        })
      )
    ).filter((p): p is { url: string; label: string } => p !== null);

    const bannerNote = pdfBuffer
      ? `<p style="color: #1c1917; font-size: 14px; margin: 0 0 16px 0; padding: 12px 14px; background: #fff; border-radius: 8px; border: 1px solid #fecdd3;"><strong style="color: #9f1239;">PDF proposal attached.</strong> Review and forward this document to ${em} when you're ready — it summarizes their inquiry with service-specific highlights.</p>`
      : `<p style="color: #b45309; font-size: 14px; margin: 0 0 16px 0;">PDF attachment could not be generated; use the summary below.</p>`;

    const inspirationSection =
      inspirationLinks.length > 0 || inspirationPhotoLinks.length > 0
        ? `<h2 style="color: #9f1239; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase;">Inspiration</h2>
        <div style="background: white; border-left: 4px solid #fda4af; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
          ${
            inspirationPhotoLinks.length > 0
              ? `<p style="color: #1c1917; font-size: 14px; margin: 0 0 8px 0;"><strong>${inspirationPhotoLinks.length}</strong> photo${inspirationPhotoLinks.length !== 1 ? "s" : ""} uploaded (links expire in 1 hour):</p>
          <ul style="margin: 0 0 10px 18px; padding: 0;">
            ${inspirationPhotoLinks
              .map(
                (p) =>
                  `<li style="margin-bottom: 4px;"><a href="${p.url}" style="color: #e11d48; font-size: 13px;">${escapeHtml(p.label)}</a></li>`
              )
              .join("")}
          </ul>`
              : ""
          }
          ${
            inspirationLinks.length > 0
              ? `<p style="color: #1c1917; font-size: 14px; margin: 0 0 8px 0;">Reference link${inspirationLinks.length !== 1 ? "s" : ""}:</p>
          <ul style="margin: 0; padding: 0 0 0 18px;">
            ${inspirationLinks
              .map(
                (link) =>
                  `<li style="margin-bottom: 4px;"><a href="${escapeHtml(link)}" style="color: #e11d48; font-size: 13px; word-break: break-all;">${escapeHtml(link)}</a></li>`
              )
              .join("")}
          </ul>`
              : ""
          }
        </div>`
        : "";

    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #fff8f0; padding: 32px; border-radius: 16px;">
        ${bannerNote}
        <h1 style="color: #881337; font-size: 28px; margin-bottom: 4px;">🎂 New Order Request</h1>
        <p style="color: #78350f; font-size: 14px; margin-top: 0;">Submitted via mackenzierosebakes.com</p>
        <hr style="border: none; border-top: 2px solid #fecdd3; margin: 20px 0;" />

        <h2 style="color: #9f1239; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase;">Contact</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="padding: 6px 0; color: #57534e; font-size: 14px; width: 140px;"><strong>Name</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${n}</td></tr>
          <tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Email</strong></td><td style="padding: 6px 0; font-size: 14px;"><a href="mailto:${encodeURIComponent(emailRaw)}" style="color: #e11d48;">${em}</a></td></tr>
          ${ph ? `<tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Phone</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${ph}</td></tr>` : ""}
          <tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Event Date</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${ev}</td></tr>
        </table>

        <h2 style="color: #9f1239; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase;">Order Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="padding: 6px 0; color: #57534e; font-size: 14px; width: 140px;"><strong>Service</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${sv}</td></tr>
          ${ss ? `<tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Serving Size</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${ss}</td></tr>` : ""}
          ${fl ? `<tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Flavors</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${fl}</td></tr>` : ""}
          ${bud ? `<tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Budget</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${bud}</td></tr>` : ""}
          ${dt ? `<tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Dietary Needs</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${dt}</td></tr>` : ""}
        </table>

        <h2 style="color: #9f1239; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase;">Design Vision</h2>
        <div style="background: white; border-left: 4px solid #fda4af; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
          <p style="color: #1c1917; font-size: 14px; margin: 0; line-height: 1.6;">${dg}</p>
        </div>

        ${inspirationSection}

        ${
          msg
            ? `<h2 style="color: #9f1239; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase;">Additional Notes</h2>
        <div style="background: white; border-left: 4px solid #fcd34d; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
          <p style="color: #1c1917; font-size: 14px; margin: 0; line-height: 1.6;">${msg}</p>
        </div>`
            : ""
        }

        ${ha ? `<p style="color: #a8a29e; font-size: 12px; margin-top: 8px;">Found us via: ${ha}</p>` : ""}

        <hr style="border: none; border-top: 2px solid #fecdd3; margin: 24px 0;" />
        <p style="color: #a8a29e; font-size: 12px; text-align: center;">
          Reply directly to <a href="mailto:${encodeURIComponent(emailRaw)}" style="color: #e11d48;">${em}</a> to respond to this inquiry.
        </p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "Mackenzie Rose Bakes <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: emailRaw || undefined,
      subject: `🎂 New Order Request — ${service} for ${name} (${eventDate})`,
      html,
      attachments:
        pdfBuffer && pdfBuffer.byteLength > 0
          ? [
              {
                filename: "proposal.pdf",
                content: pdfBuffer.toString("base64"),
                contentType: "application/pdf",
              },
            ]
          : undefined,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
