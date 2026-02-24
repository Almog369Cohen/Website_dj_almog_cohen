import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const supabase = createServerSupabase();

  // Verify user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "SESSION_EXPIRED" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.plan || !body?.couponCode) {
    return NextResponse.json({ error: "Plan and coupon code required" }, { status: 400 });
  }

  // Validate coupon
  const { data: coupon, error: couponError } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", body.couponCode.trim().toUpperCase())
    .eq("is_active", true)
    .single();

  if (couponError || !coupon) {
    return NextResponse.json({ error: "INVALID_COUPON" }, { status: 404 });
  }

  if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
    return NextResponse.json({ error: "COUPON_EXHAUSTED" }, { status: 410 });
  }

  if (coupon.plan !== body.plan) {
    return NextResponse.json({ error: "COUPON_PLAN_MISMATCH", message: "הקופון לא מתאים לחבילה הזו" }, { status: 400 });
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + coupon.duration_days * 24 * 60 * 60 * 1000);

  // Create subscription
  const { error: subError } = await supabase.from("subscriptions").insert({
    user_id: user.id,
    plan: coupon.plan,
    status: "active",
    started_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    coupon_code: coupon.code,
  });

  if (subError) {
    return NextResponse.json({ error: "SUBSCRIPTION_FAILED", details: subError.message }, { status: 500 });
  }

  // Update profile plan
  await supabase
    .from("profiles")
    .update({ plan: coupon.plan, updated_at: now.toISOString() })
    .eq("id", user.id);

  // Increment coupon uses
  await supabase
    .from("coupons")
    .update({ uses_count: coupon.uses_count + 1 })
    .eq("id", coupon.id);

  return NextResponse.json({
    success: true,
    plan: coupon.plan,
    expiresAt: expiresAt.toISOString(),
  });
}
