import { NextResponse } from "next/server";
import { requirePermission } from "@/server/require-staff";
import { createServerSupabase } from "@/lib/supabase/server";
import { logAudit } from "@/server/audit";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requirePermission(request, "support.reset_password");
  if ("error" in auth) return auth.error;

  const userId = params.id;
  const supabase = createServerSupabase();

  // Get user email
  const { data: authUser, error: userError } = await supabase.auth.admin.getUserById(userId);

  if (userError || !authUser?.user?.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check cooldown — prevent spam (60s per target)
  const { data: recentLog } = await supabase
    .from("audit_logs")
    .select("created_at")
    .eq("action", "password_reset_sent")
    .eq("target_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (recentLog) {
    const elapsed = Date.now() - new Date(recentLog.created_at).getTime();
    if (elapsed < 60_000) {
      const waitSec = Math.ceil((60_000 - elapsed) / 1000);
      return NextResponse.json(
        { error: `נסו שוב בעוד ${waitSec} שניות` },
        { status: 429 }
      );
    }
  }

  // Send password reset email via Supabase Admin
  const { error: resetError } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email: authUser.user.email,
  });

  if (resetError) {
    return NextResponse.json({ error: resetError.message }, { status: 500 });
  }

  // Audit log
  await logAudit(auth.user.id, "password_reset_sent", userId, {
    targetEmail: authUser.user.email,
  });

  // Generic success — never reveal if email exists
  return NextResponse.json({ ok: true });
}
