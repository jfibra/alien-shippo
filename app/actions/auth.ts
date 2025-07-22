"use server"

import { z } from "zod"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { UserProfile } from "@/lib/types"

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

// Define the registerSchema (example, adjust as needed)
const registerSchema = z.object({
  firstName: z.string().min(2),
  middleName: z.string().optional(),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
})

// Update the server-side auth actions to include the correct redirect URLs

// Update the register function
export async function register(formData: FormData) {
  const firstName = formData.get("firstName") as string
  const middleName = (formData.get("middleName") as string) || null
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  try {
    // Validate form data
    registerSchema.parse({
      firstName,
      middleName,
      lastName,
      email,
      password,
      confirmPassword,
    })

    const supabase = getSupabaseServerActionClient()

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
        },
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (data.user) {
      // Create user profile in the users table
      // Include a placeholder for password to satisfy the not-null constraint
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email: email,
        // password is not stored directly in public.users, it's handled by Supabase Auth
        role: "user",
        is_active: true,
        email_verified: false,
      })

      if (profileError) {
        console.error("Error creating user profile:", profileError)
        return { success: false, error: "Failed to create user profile" }
      }
    }

    // Redirect to verify email page
    redirect(`/verify-email?email=${encodeURIComponent(email)}`)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { success: false, error: firstError || "Invalid form data" }
    }

    return { success: false, error: "An error occurred during registration" }
  }
}

// Update the forgotPassword function
export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string

  try {
    if (!email) {
      return { success: false, error: "Email is required" }
    }

    const supabase = getSupabaseServerActionClient()

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, message: "Password reset email sent. Check your inbox." }
  } catch (error) {
    return { success: false, error: "An error occurred while sending the password reset email" }
  }
}

// Update the magicLinkLogin function
export async function magicLinkLogin(formData: FormData) {
  const email = formData.get("email") as string

  try {
    if (!email) {
      return { success: false, error: "Email is required" }
    }

    const supabase = getSupabaseServerActionClient()

    // Send magic link email
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Redirect to magic link confirmation page
    redirect(`/magic-link-confirmation?email=${encodeURIComponent(email)}`)
  } catch (error) {
    return { success: false, error: "An error occurred while sending the magic link" }
  }
}

// Update the updateEmail function
export async function updateEmail(formData: FormData) {
  const email = formData.get("email") as string

  try {
    if (!email) {
      return { success: false, error: "Email is required" }
    }

    const supabase = getSupabaseServerActionClient()

    // Update user email
    const { error } = await supabase.auth.updateUser({ email })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, message: "Email update initiated. Check your new email for confirmation." }
  } catch (error) {
    return { success: false, error: "An error occurred while updating your email" }
  }
}

export async function signInWithEmail(email: string, password?: string) {
  const supabase = getSupabaseServerActionClient()

  if (password) {
    // Password-based login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error signing in with password:", error)
      return { success: false, error: error.message }
    }

    if (data.user) {
      // Fetch user profile from public.users table
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        console.error("Error fetching user profile:", profileError)
        // Even if profile fetch fails, consider login successful if auth succeeded
        return { success: true, user: data.user, userProfile: null }
      }

      return { success: true, user: data.user, userProfile }
    }
  } else {
    // Magic link login
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error("Error sending magic link:", error)
      return { success: false, error: error.message }
    }
    return { success: true, message: "Magic link sent! Check your email." }
  }

  return { success: false, error: "An unexpected error occurred during sign-in." }
}

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  middleName: string | null,
  lastName: string,
) {
  const supabase = getSupabaseServerActionClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
      },
    },
  })

  if (error) {
    console.error("Error signing up:", error)
    return { success: false, error: error.message }
  }

  if (data.user) {
    // Insert into public.users table
    const { error: insertError } = await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      // password is not stored directly in public.users, it's handled by Supabase Auth
      role: "user",
      is_active: true,
      email_verified: false,
    })

    if (insertError) {
      console.error("Error inserting user into public.users:", insertError)
      // You might want to handle this more gracefully, e.g., delete the auth user if profile creation fails
      return { success: false, error: insertError.message }
    }
  }

  return { success: true, user: data.user }
}

export async function resetPassword(password: string) {
  const supabase = getSupabaseServerActionClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error("Error resetting password:", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function sendPasswordResetEmail(email: string) {
  const supabase = getSupabaseServerActionClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })

  if (error) {
    console.error("Error sending password reset email:", error)
    return { success: false, error: error.message }
  }
  return { success: true, message: "Password reset email sent. Check your inbox." }
}

export async function updateProfile(profile: Partial<UserProfile>) {
  const supabase = getSupabaseServerActionClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("Error getting user for profile update:", userError)
    return { success: false, error: userError?.message || "User not authenticated." }
  }

  const { error } = await supabase.from("users").update(profile).eq("id", user.id)

  if (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: error.message }
  }
  return { success: true, message: "Profile updated successfully." }
}
