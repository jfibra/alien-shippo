"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function getSupabaseServerActionClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
    },
  })
}

export async function getUserPreferences(userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase.from("user_preferences").select("*").eq("user_id", userId).single()
  return { preferences: data, error: error?.message }
}

export async function getUserSessions(userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("user_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("last_active", { ascending: false })
  return { sessions: data, error: error?.message }
}

export async function getApiKeys(userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("user_id", userId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
  return { keys: data, error: error?.message }
}
