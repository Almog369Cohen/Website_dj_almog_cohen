import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "NOT_AUTHENTICATED", code: "NO_TOKEN" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const supabase = createServerSupabase();

    // Verify JWT and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "SESSION_EXPIRED", code: "INVALID_TOKEN" }, { status: 401 });
    }

    const selectProfile = async () => {
      return supabase
        .from("profiles")
        .select(
          "id, email, full_name, role, plan, dj_slug, business_name, logo_url, cover_url, accent_color, tagline, bio, instagram_url, tiktok_url, website_url, whatsapp_number, soundcloud_url, spotify_url, youtube_url, custom_links, gallery_photos, reviews, onboarding_complete"
        )
        .eq("id", user.id)
        .maybeSingle();
    };

    // Read profile (service role bypasses RLS)
    let { data: profile, error: profileError } = await selectProfile();

    // Older accounts may exist without a profiles row (trigger added later) — bootstrap it.
    if (!profile && !profileError) {
      const vFullName =
        (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) ||
        "";

      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email ?? null,
        full_name: vFullName,
        role: "dj",
        plan: "free",
        onboarding_complete: false,
      });

      if (!insertError) {
        const res = await selectProfile();
        profile = res.data;
        profileError = res.error;
      } else {
        profileError = insertError;
      }
    }

    if (profileError || !profile) {
      return NextResponse.json(
        {
          error: "NO_PROFILE",
          code: "PROFILE_MISSING",
          userId: user.id,
          details: profileError?.message ?? null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      email: user.email ?? profile.email ?? "",
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
      soundcloudUrl: profile.soundcloud_url ?? null,
      spotifyUrl: profile.spotify_url ?? null,
      youtubeUrl: profile.youtube_url ?? null,
      customLinks: Array.isArray(profile.custom_links) ? profile.custom_links : [],
      galleryPhotos: Array.isArray(profile.gallery_photos) ? profile.gallery_photos : [],
      reviews: Array.isArray(profile.reviews) ? profile.reviews : [],
      onboardingComplete: profile.onboarding_complete ?? false,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    const envMissing = message.includes("Missing NEXT_PUBLIC_SUPABASE_URL") || message.includes("SUPABASE_SERVICE_ROLE_KEY");
    return NextResponse.json(
      {
        error: envMissing ? "SERVER_ENV_MISSING" : message,
        code: envMissing ? "SERVER_ENV_MISSING" : "INTERNAL",
      },
      { status: 500 }
    );
  }
}
