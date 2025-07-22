"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { PaymentMethod } from "./types"

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

export async function getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false }) // Default method first

  if (error) {
    console.error("Error fetching payment methods:", error)
    return []
  }
  return data || []
}

export async function addPaymentMethod(
  method: Omit<PaymentMethod, "id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerActionClient()

  // If setting as default, first unset all other default payment methods for this user
  if (method.is_default) {
    await supabase
      .from("payment_methods")
      .update({ is_default: false })
      .eq("user_id", method.user_id)
      .eq("is_default", true)
  }

  const { error } = await supabase.from("payment_methods").insert(method)

  if (error) {
    console.error("Error adding payment method:", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function updatePaymentMethod(method: PaymentMethod): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerActionClient()

  // If setting as default, first unset all other default payment methods for this user
  if (method.is_default) {
    await supabase
      .from("payment_methods")
      .update({ is_default: false })
      .eq("user_id", method.user_id)
      .eq("is_default", true)
  }

  const { error } = await supabase.from("payment_methods").update(method).eq("id", method.id!)

  if (error) {
    console.error("Error updating payment method:", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function deletePaymentMethod(id: string, userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerActionClient()
  const { error } = await supabase.from("payment_methods").delete().eq("id", id).eq("user_id", userId)

  if (error) {
    console.error("Error deleting payment method:", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function setDefaultPaymentMethod(
  id: string,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerActionClient()

  try {
    // Unset current default for this user
    await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", userId).eq("is_default", true)

    // Set the specified payment method as default
    const { error } = await supabase
      .from("payment_methods")
      .update({ is_default: true })
      .eq("id", id)
      .eq("user_id", userId) // Ensure user owns the payment method

    if (error) {
      console.error("Error setting default payment method:", error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (error: any) {
    console.error("Server error setting default payment method:", error)
    return { success: false, error: error.message }
  }
}
