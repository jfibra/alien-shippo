"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Transaction } from "./types"

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

export async function getTransactions(
  userId: string,
  page = 1,
  pageSize = 10,
): Promise<{ transactions: Transaction[]; totalCount: number }> {
  const supabase = getSupabaseServerActionClient()
  const offset = (page - 1) * pageSize

  const { data, error, count } = await supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (error) {
    console.error("Error fetching transactions:", error)
    return { transactions: [], totalCount: 0 }
  }

  return { transactions: data || [], totalCount: count || 0 }
}

export async function addTransaction(
  transaction: Omit<Transaction, "id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerActionClient()
  const { error } = await supabase.from("transactions").insert(transaction)

  if (error) {
    console.error("Error adding transaction:", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}
