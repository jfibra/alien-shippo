import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Validation schema for user profile updates
const userProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100),
  middle_name: z.string().max(100).nullable().optional(),
  last_name: z.string().min(1, "Last name is required").max(100),
  phone: z.string().max(20).nullable().optional(),
  company: z.string().max(100).nullable().optional(),
  website: z.string().url("Invalid website URL").max(255).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  email_notifications: z.boolean().optional(),
  app_notifications: z.boolean().optional(),
})

export type UserProfile = z.infer<typeof userProfileSchema> & {
  id: string
  email: string
  role: string
  email_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  last_login: string | null
  last_active: string | null
  full_name: string
  profile_image_url: string | null
  is_deleted: boolean
}

// Get user profile by ID
export async function getUserProfile(userId: string): Promise<{ data: UserProfile | null; error: string | null }> {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).eq("is_deleted", false).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    console.error("Unexpected error fetching user profile:", err)
    return { data: null, error: "Failed to fetch user profile" }
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>,
): Promise<{ data: UserProfile | null; error: string | null }> {
  try {
    // Validate the updates
    const validatedUpdates = userProfileSchema.partial().parse(updates)

    // Add updated timestamp
    const updateData = {
      ...validatedUpdates,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .eq("is_deleted", false)
      .select("*")
      .single()

    if (error) {
      console.error("Error updating user profile:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const firstError = err.errors[0]
      return { data: null, error: firstError.message }
    }
    console.error("Unexpected error updating user profile:", err)
    return { data: null, error: "Failed to update user profile" }
  }
}

// Update user email (requires email verification)
export async function updateUserEmail(
  userId: string,
  newEmail: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Validate email format
    const emailSchema = z.string().email("Invalid email address")
    const validatedEmail = emailSchema.parse(newEmail)

    // Update in Supabase Auth first
    const { error: authError } = await supabase.auth.updateUser({
      email: validatedEmail,
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    // Update in users table
    const { error: dbError } = await supabase
      .from("users")
      .update({
        email: validatedEmail,
        email_verified: false, // Reset verification status
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (dbError) {
      console.error("Error updating email in database:", dbError)
      return { success: false, error: "Failed to update email in database" }
    }

    return { success: true, error: null }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0].message }
    }
    console.error("Unexpected error updating email:", err)
    return { success: false, error: "Failed to update email" }
  }
}

// Deactivate user account (soft delete)
export async function deactivateUserAccount(userId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Error deactivating user account:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error("Unexpected error deactivating account:", err)
    return { success: false, error: "Failed to deactivate account" }
  }
}

// Get user activity summary
export async function getUserActivitySummary(userId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("last_login, last_active, created_at, email_verified, is_active")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error fetching user activity:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    console.error("Unexpected error fetching user activity:", err)
    return { data: null, error: "Failed to fetch user activity" }
  }
}
