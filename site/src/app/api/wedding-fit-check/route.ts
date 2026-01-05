import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const coupleNames = String(form.get("coupleNames") || "");
    const weddingDate = String(form.get("weddingDate") || "");
    const weddingLocation = String(form.get("weddingLocation") || "");
    const eventSize = String(form.get("eventSize") || "");
    const mostImportant = String(form.get("mostImportant") || "");
    const biggestFear = String(form.get("biggestFear") || "");
    const decisionStyle = String(form.get("decisionStyle") || "");
    const budgetComfort = String(form.get("budgetComfort") || "");
    const commitment = String(form.get("commitment") || "");

    const notifyEmail = process.env.NOTIFY_EMAIL || "almogmusiccohen@gmail.com";
    const resendKey = process.env.RESEND_API_KEY;

    const text = [
      "Wedding Fit Check Submission",
      "",
      `Couple: ${coupleNames}`,
      `Date: ${weddingDate}`,
      `Location: ${weddingLocation}`,
      `Event size: ${eventSize}`,
      "",
      "Most important:",
      mostImportant,
      "",
      "Biggest fear:",
      biggestFear,
      "",
      `Decision style: ${decisionStyle}`,
      `Budget comfort: ${budgetComfort}`,
      `Commitment confirmed: ${commitment}`,
    ].join("\n");

    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: notifyEmail,
          subject: `Wedding Fit Check: ${coupleNames || "Unknown"}`,
          text,
        }),
      });
    } else {
      console.log(
        "[Fit Check - email not sent] Configure RESEND_API_KEY to enable email notifications.",
        {
          coupleNames,
          weddingDate,
          weddingLocation,
          eventSize,
          decisionStyle,
          budgetComfort,
        }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("/api/wedding-fit-check error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
