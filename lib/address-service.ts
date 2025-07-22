/**
 * Address-related helpers that run on the server.
 * Uses the singleton Supabase server client already present in the repo.
 *
 * NOTE: Adjust the table / column names if your schema differs.
 */

import "server-only"
import { z } from "zod"
import { supabaseServer } from "@/lib/supabase-server" // existing singleton

/* ---------- Types ---------- */

export const addressSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  company: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  email: z.string().email().optional().nullable(),
  street1: z.string().min(1).max(255),
  street2: z.string().max(255).optional().nullable(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  postal_code: z.string().min(1).max(20),
  country: z.string().min(2).max(2),
})

export type AddressInput = z.infer<typeof addressSchema>
export type Address = AddressInput & { id: string }

/* ---------- CRUD helpers ---------- */

export async function getAllAddresses(userId: string) {
  const { data, error } = await supabaseServer
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return { data, error }
}

export async function addAddress(input: AddressInput) {
  const validated = addressSchema.safeParse(input)
  if (!validated.success) {
    return { data: null, error: validated.error.message }
  }

  const { data, error } = await supabaseServer.from("addresses").insert(validated.data).select().single()

  return { data, error }
}

export async function updateAddress(id: string, input: Partial<AddressInput>) {
  const { data, error } = await supabaseServer.from("addresses").update(input).eq("id", id).select().single()

  return { data, error }
}

export async function deleteAddress(id: string) {
  const { error } = await supabaseServer.from("addresses").delete().eq("id", id)
  return { success: !error, error }
}
