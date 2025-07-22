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

export type UserPreferences = {
  id: string
  user_id: string
  date_format: string
  time_zone: string
  weight_unit: string
  dimension_unit: string
  default_service: string | null
  default_package: string | null
  auto_refresh_status: boolean
  confirm_actions: boolean
  created_at: string
  updated_at: string
}

export type UserSession = {
  id: string
  user_id: string
  device_info: string | null
  ip_address: string | null
  last_active: string
  is_current: boolean
  created_at: string
}

export type ApiKey = {
  id: string
  user_id: string
  key_name: string
  key_value: string
  is_test: boolean
  is_active: boolean
  last_used: string | null
  created_at: string
  expires_at: string | null
  is_deleted: boolean
}

export async function getUserPreferences(userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase.from("user_preferences").select("*").eq("user_id", userId).single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user preferences:", error)
    return { preferences: null, error: error.message }
  }

  return { preferences: data, error: null }
}

export async function getUserSessions(userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("user_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("last_active", { ascending: false })

  if (error) {
    console.error("Error fetching user sessions:", error)
    return { sessions: [], error: error.message }
  }

  return { sessions: data || [], error: null }
}

export async function getApiKeys(userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("user_id", userId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching API keys:", error)
    return { keys: [], error: error.message }
  }

  return { keys: data || [], error: null }
}
