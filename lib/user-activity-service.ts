"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { UserActivity } from "./types"

function getSupabaseServerActionClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
      remove: (name: string, options: any) => cookieStore.set(name, "", options),
    },
  })
}

export async function getRecentActivity(userId: string, limit = 5): Promise<UserActivity[]> {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("user_activities")
    .select("*")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent user activity:", error)
    return []
  }
  return data || []
}

export async function addActivity(
  activity: Omit<UserActivity, "id" | "timestamp">,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerActionClient()
  const { error } = await supabase.from("user_activities").insert(activity)

  if (error) {
    console.error("Error adding user activity:", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}
