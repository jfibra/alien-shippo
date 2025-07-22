"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"
import { revalidatePath } from "next/cache"

// Helper to get Supabase client for server actions
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

// Validation schema
const profileUpdateSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100),
  middle_name: z.string().max(100).optional(),
  last_name: z.string().min(1, "Last name is required").max(100),
  phone: z.string().max(20).optional(),
  company: z.string().max(100).optional(),
  website: z.string().url("Invalid website URL").max(255).optional(),
  bio: z.string().max(500).optional(),
  email_notifications: z.boolean().optional(),
  app_notifications: z.boolean().optional(),
})

export async function updateUserProfile(formData: FormData) {
  try {
    const supabase = getSupabaseServerActionClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Extract and validate form data
    const rawData = {
      first_name: formData.get("first_name") as string,
      middle_name: (formData.get("middle_name") as string) || null,
      last_name: formData.get("last_name") as string,
      phone: (formData.get("phone") as string) || null,
      company: (formData.get("company") as string) || null,
      website: (formData.get("website") as string) || null,
      bio: (formData.get("bio") as string) || null,
      email_notifications: formData.get("email_notifications") === "true",
      app_notifications: formData.get("app_notifications") === "true",
    }

    // Remove empty strings and convert to null
    const cleanedData = Object.fromEntries(
      Object.entries(rawData).map(([key, value]) => [key, value === "" ? null : value]),
    )

    const validatedData = profileUpdateSchema.parse(cleanedData)

    // Update user profile
    const { data, error } = await supabase
      .from("users")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("*")
      .single()

    if (error) {
      console.error("Error updating user profile:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the profile page
    revalidatePath("/dashboard/profile")

    return { success: true, data, message: "Profile updated successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return { success: false, error: firstError.message }
    }

    console.error("Unexpected error updating profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

export async function updateUserEmail(formData: FormData) {
  try {
    const supabase = getSupabaseServerActionClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    const newEmail = formData.get("email") as string

    // Validate email
    const emailSchema = z.string().email("Invalid email address")
    const validatedEmail = emailSchema.parse(newEmail)

    // Update email in Supabase Auth (this will send a confirmation email)
    const { error: authError } = await supabase.auth.updateUser({
      email: validatedEmail,
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    // Update email in users table
    const { error: dbError } = await supabase
      .from("users")
      .update({
        email: validatedEmail,
        email_verified: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (dbError) {
      console.error("Error updating email in database:", dbError)
      return { success: false, error: "Failed to update email in database" }
    }

    revalidatePath("/dashboard/profile")

    return {
      success: true,
      message: "Email update initiated. Please check your new email for confirmation.",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    console.error("Unexpected error updating email:", error)
    return { success: false, error: "Failed to update email" }
  }
}

export async function deactivateAccount() {
  try {
    const supabase = getSupabaseServerActionClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Deactivate account
    const { error } = await supabase
      .from("users")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      console.error("Error deactivating account:", error)
      return { success: false, error: error.message }
    }

    // Sign out the user
    await supabase.auth.signOut()

    return { success: true, message: "Account deactivated successfully" }
  } catch (error) {
    console.error("Unexpected error deactivating account:", error)
    return { success: false, error: "Failed to deactivate account" }
  }
}
