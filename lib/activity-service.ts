"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

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

export type ActivityLogType = {
  id: string
  user_id: string
  action: string
  target_table: string | null
  target_id: string | null
  meta: Record<string, any> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export async function getAllActivityLogs(userId: string, page = 1, pageSize = 10, filters: any = {}) {
  const supabase = getSupabaseServerActionClient()
  const offset = (page - 1) * pageSize

  let query = supabase
    .from("activity_logs")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (filters.action && filters.action !== "all") {
    query = query.eq("action", filters.action)
  }

  if (filters.target_table && filters.target_table !== "all") {
    query = query.eq("target_table", filters.target_table)
  }

  if (filters.startDate) {
    query = query.gte("created_at", filters.startDate)
  }

  if (filters.endDate) {
    query = query.lte("created_at", filters.endDate)
  }

  if (filters.search) {
    query = query.or(`action.ilike.%${filters.search}%,ip_address.ilike.%${filters.search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching activity logs:", error)
    return { data: [], count: 0 }
  }

  return { data: data || [], count: count || 0 }
}

export async function getUserActivityLogs(page = 1, pageSize = 10, filters: any = {}) {
  const supabase = getSupabaseServerActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: [], count: 0 }
  }

  return getAllActivityLogs(user.id, page, pageSize, filters)
}
