import "server-only";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";

export type AdminGate =
  | { ok: true; userId: string }
  | { ok: false; reason: "unconfigured" | "forbidden" };

export async function requireAdmin(): Promise<AdminGate> {
  if (!isSupabaseConfigured()) return { ok: false, reason: "unconfigured" };

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { ok: false, reason: "forbidden" };

  const isAdmin = data.user.app_metadata?.is_admin === true;
  if (!isAdmin) return { ok: false, reason: "forbidden" };

  return { ok: true, userId: data.user.id };
}

export async function currentUserId() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}
