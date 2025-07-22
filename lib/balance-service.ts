"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { AccountBalance } from "./types"

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

export async function getAccountBalance(userId: string): Promise<AccountBalance | null> {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase.from("user_accounts").select("balance").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching account balance:", error)
    // If no record found, return a default balance of 0
    if (error.code === "PGRST116") {
      // No rows found
      return { user_id: userId, balance: 0 }
    }
    return null
  }

  return { user_id: userId, balance: data.balance }
}

export async function addFundsToBalance(userId: string, amount: number): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerActionClient()

  // Call the Supabase RPC function to add funds
  const { error } = await supabase.rpc("add_funds", {
    p_user_id: userId,
    p_amount: amount,
  })

  if (error) {
    console.error("Error adding funds via RPC:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deductFundsFromBalance(
  userId: string,
  amount: number,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerActionClient()

  // Call the Supabase RPC function to deduct funds
  const { error } = await supabase.rpc("deduct_funds", {
    p_user_id: userId,
    p_amount: amount,
  })

  if (error) {
    console.error("Error deducting funds via RPC:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
