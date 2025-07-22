import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

/**
 * Singleton Supabase service-role client (server-only).
 * We use the service role key so the dashboard can list logs that
 * belong to any user (e.g. for admin views).  NEVER expose this key
 * to the browser; this module is only imported in Server Components
 * or server actions/route-handlers.
 */
const supabaseAdmin =
  /* ensure a single instance in dev hot-reload */ (
    globalThis as unknown as { __supabaseAdmin?: ReturnType<typeof createClient> }
  ).__supabaseAdmin ??
  createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

if (!(globalThis as any).__supabaseAdmin) {
  ;(globalThis as any).__supabaseAdmin = supabaseAdmin
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"]

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/**
 * Fetch **all** activity logs (admin view).
 * @param limit  Maximum number of rows to return (default 100)
 */
export async function getAllActivityLogs(limit = 100): Promise<ActivityLog[]> {
  const { data, error } = await supabaseAdmin
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[activity-service] getAllActivityLogs ➜", error.message)
    return []
  }

  return data ?? []
}

/**
 * Fetch recent activity logs for a single user.
 * @param userId Supabase auth.user().id
 * @param limit  Maximum number of rows to return (default 50)
 */
export async function getUserActivityLogs(userId: string, limit = 50): Promise<ActivityLog[]> {
  const { data, error } = await supabaseAdmin
    .from("activity_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[activity-service] getUserActivityLogs ➜", error.message)
    return []
  }

  return data ?? []
}
