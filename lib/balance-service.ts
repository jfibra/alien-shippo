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

export type UserAccount = {
  id: string
  user_id: string
  balance: number
  currency: string
  last_deposit_date: string | null
  last_updated: string
  created_at: string
}

export async function getAccountBalance(userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase.from("user_accounts").select("*").eq("user_id", userId).single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching account balance:", error)
    return null
  }

  return data
}

export async function updateAccountBalance(userId: string, newBalance: number) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("user_accounts")
    .update({
      balance: newBalance,
      last_updated: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating account balance:", error)
    return { success: false, error: error.message }
  }

  return { success: true, account: data }
}

export async function addFunds(userId: string, amount: number) {
  const supabase = getSupabaseServerActionClient()

  // Get current balance
  const currentAccount = await getAccountBalance(userId)
  const currentBalance = currentAccount?.balance || 0
  const newBalance = currentBalance + amount

  // Update balance
  const result = await updateAccountBalance(userId, newBalance)

  if (result.success) {
    // Record transaction
    await supabase.from("transactions").insert({
      user_id: userId,
      amount,
      status: "completed",
      provider: "manual",
      transaction_reference: `deposit_${Date.now()}`,
    })
  }

  return result
}
