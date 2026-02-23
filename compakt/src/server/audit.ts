import { createServerSupabase } from "@/lib/supabase/server";

export async function logAudit(
  actorId: string,
  action: string,
  targetId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = createServerSupabase();
    await supabase.from("audit_logs").insert({
      actor_id: actorId,
      action,
      target_id: targetId ?? null,
      metadata: metadata ?? {},
    });
  } catch (e) {
    console.error("[audit] Failed to write audit log:", e);
  }
}
