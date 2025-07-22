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

const preferencesSchema = z.object({
  date_format: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]),
  time_zone: z.string(),
  weight_unit: z.enum(["imperial", "metric"]),
  dimension_unit: z.enum(["imperial", "metric"]),
  default_service: z.string().optional(),
  default_package: z.string().optional(),
  auto_refresh_status: z.boolean(),
  confirm_actions: z.boolean(),
})

export async function updatePreferences(formData: FormData) {
  const supabase = getSupabaseServerActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const rawData = Object.fromEntries(formData.entries())
  const parsed = preferencesSchema.safeParse({
    ...rawData,
    auto_refresh_status: rawData.auto_refresh_status === "true",
    confirm_actions: rawData.confirm_actions === "true",
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from("user_preferences")
    .upsert({ ...parsed.data, user_id: user.id }, { onConflict: "user_id" })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/settings")
  return { success: true, message: "Preferences updated." }
}

export async function revokeSession(sessionId: string) {
  const supabase = getSupabaseServerActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // For security, you can't revoke the current session this way.
  // This is a placeholder for a more complex session management logic.
  const { error } = await supabase.from("user_sessions").delete().eq("id", sessionId).eq("user_id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/settings")
  return { success: true, message: "Session revoked." }
}

export async function generateApiKey(keyName: string, isTest: boolean) {
  const supabase = getSupabaseServerActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const keyValue =
    `vf_` +
    Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

  const { error } = await supabase.from("api_keys").insert({
    user_id: user.id,
    key_name: keyName,
    key_value: keyValue,
    is_test: isTest,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/settings")
  return { success: true, message: "API Key generated." }
}

export async function revokeApiKey(keyId: string) {
  const supabase = getSupabaseServerActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { error } = await supabase.from("api_keys").update({ is_active: false }).eq("id", keyId).eq("user_id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/settings")
  return { success: true, message: "API Key revoked." }
}
