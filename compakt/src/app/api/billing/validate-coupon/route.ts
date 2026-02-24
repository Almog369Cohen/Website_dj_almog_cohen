import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.code) {
    return NextResponse.json({ error: "Coupon code required" }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", body.code.trim().toUpperCase())
    .eq("is_active", true)
    .single();

  if (error || !coupon) {
    return NextResponse.json({ error: "INVALID_COUPON", message: "קוד קופון לא תקין" }, { status: 404 });
  }

  if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
    return NextResponse.json({ error: "COUPON_EXHAUSTED", message: "קופון מנוצל" }, { status: 410 });
  }

  return NextResponse.json({
    valid: true,
    plan: coupon.plan,
    durationDays: coupon.duration_days,
    code: coupon.code,
  });
}
