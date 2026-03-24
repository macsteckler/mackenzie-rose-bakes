import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.ORDER_EMAIL ?? "";

export async function POST(request: NextRequest) {
  if (!process.env.RESEND_API_KEY || !TO_EMAIL) {
    return NextResponse.json(
      { error: "Email service not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

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

    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #fff8f0; padding: 32px; border-radius: 16px;">
        <h1 style="color: #881337; font-size: 28px; margin-bottom: 4px;">🎂 New Order Request</h1>
        <p style="color: #78350f; font-size: 14px; margin-top: 0;">Submitted via mackenzierosebakes.com</p>
        <hr style="border: none; border-top: 2px solid #fecdd3; margin: 20px 0;" />

        <h2 style="color: #9f1239; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase;">Contact</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="padding: 6px 0; color: #57534e; font-size: 14px; width: 140px;"><strong>Name</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${name}</td></tr>
          <tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Email</strong></td><td style="padding: 6px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #e11d48;">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Phone</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${phone}</td></tr>` : ""}
          <tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Event Date</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${eventDate}</td></tr>
        </table>

        <h2 style="color: #9f1239; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase;">Order Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="padding: 6px 0; color: #57534e; font-size: 14px; width: 140px;"><strong>Service</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${service}</td></tr>
          ${servingSize ? `<tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Serving Size</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${servingSize}</td></tr>` : ""}
          ${flavors ? `<tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Flavors</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${flavors}</td></tr>` : ""}
          ${budget ? `<tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Budget</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${budget}</td></tr>` : ""}
          ${dietary ? `<tr><td style="padding: 6px 0; color: #57534e; font-size: 14px;"><strong>Dietary Needs</strong></td><td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${dietary}</td></tr>` : ""}
        </table>

        <h2 style="color: #9f1239; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase;">Design Vision</h2>
        <div style="background: white; border-left: 4px solid #fda4af; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
          <p style="color: #1c1917; font-size: 14px; margin: 0; line-height: 1.6;">${design}</p>
        </div>

        ${
          message
            ? `<h2 style="color: #9f1239; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase;">Additional Notes</h2>
        <div style="background: white; border-left: 4px solid #fcd34d; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
          <p style="color: #1c1917; font-size: 14px; margin: 0; line-height: 1.6;">${message}</p>
        </div>`
            : ""
        }

        ${hearAbout ? `<p style="color: #a8a29e; font-size: 12px; margin-top: 8px;">Found us via: ${hearAbout}</p>` : ""}

        <hr style="border: none; border-top: 2px solid #fecdd3; margin: 24px 0;" />
        <p style="color: #a8a29e; font-size: 12px; text-align: center;">
          Reply directly to <a href="mailto:${email}" style="color: #e11d48;">${email}</a> to respond to this inquiry.
        </p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "Mackenzie Rose Bakes <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `🎂 New Order Request — ${service} for ${name} (${eventDate})`,
      html,
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
