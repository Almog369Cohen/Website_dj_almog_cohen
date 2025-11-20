import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const name = String(form.get("name") || "");
    const phone = String(form.get("phone") || "");
    const email = String(form.get("email") || "");
    const message = String(form.get("message") || "");

    const notifyEmail = process.env.NOTIFY_EMAIL || "almogmusiccohen@gmail.com";
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: notifyEmail,
          subject: `New lead from website: ${name || "Unknown"}`,
          text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`,
        }),
      });
    } else {
      console.log("[Lead - email not sent] Configure RESEND_API_KEY to enable email notifications.", { name, phone, email, message });
    }

    return NextResponse.redirect(new URL("/contact?success=1", request.url), {
      status: 303,
    });
  } catch (err) {
    console.error("/api/contact error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
