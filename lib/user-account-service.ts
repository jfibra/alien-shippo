"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { UserAccount } from "./types"

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

export async function getUserAccount(userId: string): Promise<UserAccount | null> {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase.from("user_accounts").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching user account:", error)
    return null
  }
  return data || null
}

export async function createUserAccount(
  account: Omit<UserAccount, "created_at" | "updated_at">,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerActionClient()
  const { error } = await supabase.from("user_accounts").insert(account)

  if (error) {
    console.error("Error creating user account:", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function updateUserAccount(account: Partial<UserAccount>): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerActionClient()
  const { error } = await supabase.from("user_accounts").update(account).eq("user_id", account.user_id!)

  if (error) {
    console.error("Error updating user account:", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}
