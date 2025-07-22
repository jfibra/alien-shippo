"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"
import { revalidatePath } from "next/cache"

function getSupabaseServerActionClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
    },
  })
}

const addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  recipient_name: z.string().min(1, "Recipient name is required"),
  company_name: z.string().optional(),
  address_line1: z.string().min(1, "Address is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  address_type: z.enum(["shipping", "billing", "return", "both"]),
  is_residential: z.boolean(),
})

export async function addAddress(formData: FormData) {
  const supabase = getSupabaseServerActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const rawData = Object.fromEntries(formData.entries())
  const parsed = addressSchema.safeParse({
    ...rawData,
    is_residential: rawData.is_residential === "true",
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from("addresses").insert({ ...parsed.data, user_id: user.id })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/addresses")
  return { success: true }
}

export async function updateAddress(addressId: string, formData: FormData) {
  const supabase = getSupabaseServerActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const rawData = Object.fromEntries(formData.entries())
  const parsed = addressSchema.safeParse({
    ...rawData,
    is_residential: rawData.is_residential === "true",
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from("addresses").update(parsed.data).eq("id", addressId).eq("user_id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/addresses")
  return { success: true }
}

export async function deleteAddress(addressId: string) {
  const supabase = getSupabaseServerActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { error } = await supabase
    .from("addresses")
    .update({ is_deleted: true })
    .eq("id", addressId)
    .eq("user_id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/addresses")
  return { success: true }
}

export async function setDefaultAddress(addressId: string, type: "shipping" | "return") {
  const supabase = getSupabaseServerActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // First, unset all other defaults for this type
  await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id).eq("address_type", type)

  // Then, set the new default
  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/addresses")
  return { success: true }
}
