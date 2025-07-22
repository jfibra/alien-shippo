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

export type Address = {
  id: string
  user_id: string
  name: string
  company_name: string | null
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
  is_residential: boolean
  address_type: string
  email: string | null
  phone: string | null
  recipient_name: string | null
}

export async function getAllAddresses(userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching addresses:", error)
    return { addresses: [], error: error.message }
  }

  return { addresses: data || [], error: null }
}

export async function addAddress(address: Omit<Address, "id" | "created_at">) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase.from("addresses").insert(address).select().single()

  if (error) {
    console.error("Error adding address:", error)
    return { success: false, error: error.message }
  }

  return { success: true, address: data }
}

export async function updateAddress(id: string, updates: Partial<Address>) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase.from("addresses").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating address:", error)
    return { success: false, error: error.message }
  }

  return { success: true, address: data }
}

export async function deleteAddress(id: string) {
  const supabase = getSupabaseServerActionClient()
  const { error } = await supabase.from("addresses").update({ is_deleted: true }).eq("id", id)

  if (error) {
    console.error("Error deleting address:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
