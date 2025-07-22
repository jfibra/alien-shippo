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

export type SupportTicket = {
  id: string
  user_id: string
  subject: string
  message: string
  status: string
  admin_notes: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
}

export async function getSupportTickets(userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching support tickets:", error)
    return { tickets: [], error: error.message }
  }

  return { tickets: data || [], error: null }
}

export async function createSupportTicket(userId: string, subject: string, message: string) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("support_tickets")
    .insert({
      user_id: userId,
      subject,
      message,
      status: "open",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating support ticket:", error)
    return { success: false, error: error.message }
  }

  return { success: true, ticket: data }
}
