import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const supabase = createServerSupabase();
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const body = (await req.json().catch(() => null)) as null | {
      businessName?: string;
      tagline?: string | null;
      accentColor?: string;
      slug?: string;
    };

    if (!body) return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });

    const businessName = (body.businessName ?? "").trim();
    const tagline = (body.tagline ?? "").trim();
    const accentColor = (body.accentColor ?? "#059cc0").trim();
    const cleanSlug = (body.slug ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    if (!businessName) return NextResponse.json({ error: "BUSINESS_NAME_REQUIRED" }, { status: 400 });
    if (!cleanSlug) return NextResponse.json({ error: "SLUG_REQUIRED" }, { status: 400 });

    const { data: existing, error: existingErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("dj_slug", cleanSlug)
      .neq("id", user.id)
      .limit(1);

    if (existingErr) {
      return NextResponse.json({ error: existingErr.message }, { status: 500 });
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "SLUG_TAKEN" }, { status: 409 });
    }

    const { error: updateErr } = await supabase
      .from("profiles")
      .update({
        business_name: businessName,
        tagline: tagline || null,
        accent_color: accentColor,
        dj_slug: cleanSlug,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateErr) {
      const msg = (updateErr as { message?: string; code?: string }).message ?? "";
      const code = (updateErr as { code?: string }).code;
      const isUnique = code === "23505" || msg.includes("dj_slug") || msg.toLowerCase().includes("duplicate");
      if (isUnique) {
        return NextResponse.json({ error: "SLUG_TAKEN" }, { status: 409 });
      }
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Seed default questions & songs for new DJ (safe to call even if already seeded)
    try {
      const seedUrl = new URL("/api/admin/seed-defaults", req.url);
      await fetch(seedUrl.toString(), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (seedErr) {
      console.error("[onboarding/finish] seed-defaults call failed:", seedErr);
    }

    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select(
        "id, email, full_name, role, plan, dj_slug, business_name, logo_url, cover_url, accent_color, tagline, bio, instagram_url, tiktok_url, website_url, whatsapp_number, reviews, onboarding_complete"
      )
      .eq("id", user.id)
      .single();

    if (profErr || !profile) {
      return NextResponse.json({ error: "PROFILE_LOAD_FAILED" }, { status: 500 });
    }

    return NextResponse.json({
      id: profile.id,
      email: profile.email ?? user.email ?? "",
      fullName: profile.full_name ?? "",
      role: profile.role ?? "dj",
      plan: profile.plan ?? "free",
      djSlug: profile.dj_slug ?? null,
      businessName: profile.business_name ?? null,
      logoUrl: profile.logo_url ?? null,
      coverUrl: profile.cover_url ?? null,
      accentColor: profile.accent_color ?? "#059cc0",
      tagline: profile.tagline ?? null,
      bio: profile.bio ?? null,
      instagramUrl: profile.instagram_url ?? null,
      tiktokUrl: profile.tiktok_url ?? null,
      websiteUrl: profile.website_url ?? null,
      whatsappNumber: profile.whatsapp_number ?? null,
      reviews: Array.isArray(profile.reviews) ? profile.reviews : [],
      onboardingComplete: profile.onboarding_complete ?? false,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
