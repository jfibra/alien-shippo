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

export async function getSupportTickets(userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    return { tickets: null, error: error.message }
  }
  return { tickets: data, error: null }
}
