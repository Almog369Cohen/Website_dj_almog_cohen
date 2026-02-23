import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/server/require-staff";
import { createServerSupabase } from "@/lib/supabase/server";
import { logAudit } from "@/server/audit";

const STAFF_ROLES = ["owner", "admin", "support", "accountant", "assistant"] as const;
const bodySchema = z.object({
  role: z.enum(STAFF_ROLES),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requirePermission(request, "team.manage");
  if ("error" in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const targetId = params.id;
  const newRole = parsed.data.role;
  const supabase = createServerSupabase();

  // Fetch actor's own role
  const { data: actorProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .single();

  const actorRole = actorProfile?.role ?? "";

  // Safety: only owner can promote to owner/admin
  if ((newRole === "owner" || newRole === "admin") && actorRole !== "owner") {
    return NextResponse.json(
      { error: "רק בעלים יכול לקדם לאדמין או בעלים" },
      { status: 403 }
    );
  }

  // Safety: cannot demote owner unless you are owner
  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", targetId)
    .single();

  if (!targetProfile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (targetProfile.role === "owner" && actorRole !== "owner") {
    return NextResponse.json(
      { error: "לא ניתן לשנות תפקיד של בעלים" },
      { status: 403 }
    );
  }

  // Safety: self-demotion requires explicit intent (handled by UI confirmation)
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq("id", targetId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await logAudit(auth.user.id, "role_changed", targetId, {
    oldRole: targetProfile.role,
    newRole,
  });

  return NextResponse.json({ ok: true });
}
