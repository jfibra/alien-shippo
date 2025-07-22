import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { ActivityLog } from "./types"

// Mock activity service for demo purposes

export async function getRecentActivityLogs(userId: string, limit = 5): Promise<ActivityLog[]> {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
        remove: (name: string, options: any) => cookieStore.set(name, "", options),
      },
    },
  )

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent activity logs:", error)
    return []
  }

  return data || []
}

export async function getAllActivityLogs(
  userId: string,
  page = 1,
  pageSize = 10,
): Promise<{ logs: ActivityLog[]; totalCount: number }> {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
        remove: (name: string, options: any) => cookieStore.set(name, "", options),
      },
    },
  )

  const offset = (page - 1) * pageSize

  const { data, error, count } = await supabase
    .from("activity_logs")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (error) {
    console.error("Error fetching all activity logs:", error)
    return { logs: [], totalCount: 0 }
  }

  return { logs: data || [], totalCount: count || 0 }
}

export async function addActivityLog(
  log: Omit<ActivityLog, "id" | "created_at">,
): Promise<{ success: boolean; error?: string }> {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
        remove: (name: string, options: any) => cookieStore.set(name, "", options),
      },
    },
  )

  const { error } = await supabase.from("activity_logs").insert(log)

  if (error) {
    console.error("Error adding activity log:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Mock activity service for dashboard demo
export async function getUserActivityLogs(userId: string) {
  // Return mock activity data
  return {
    success: true,
    data: [
      {
        id: "activity_1",
        user_id: userId,
        action: "shipment_created",
        description: "Created new shipment AS123456789",
        created_at: "2024-07-20T10:00:00Z",
      },
      {
        id: "activity_2",
        user_id: userId,
        action: "funds_added",
        description: "Added $100.00 to account",
        created_at: "2024-07-19T14:30:00Z",
      },
    ],
  }
}
