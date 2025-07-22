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

// Define validation schemas
const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    middleName: z.string().optional().nullable(),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Register function
export async function register(formData: FormData) {
  const firstName = formData.get("firstName") as string
  const middleName = formData.get("middleName") as string | null
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  try {
    // Validate form data
    const validatedData = registerSchema.parse({
      firstName,
      middleName,
      lastName,
      email,
      password,
      confirmPassword,
    })

    const supabase = getSupabaseServerActionClient()

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          first_name: validatedData.firstName,
          middle_name: validatedData.middleName || null,
          last_name: validatedData.lastName,
        },
      },
    })

    if (error) {
      console.error("Supabase auth signup error:", error)
      return { success: false, error: error.message }
    }

    if (data.user) {
      // Create user profile in the users table
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email: validatedData.email,
        password: "", // Password is handled by Supabase Auth, we just need a placeholder
        first_name: validatedData.firstName,
        middle_name: validatedData.middleName || null,
        last_name: validatedData.lastName,
        role: "user",
        email_verified: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("Error creating user profile:", profileError)
        return { success: false, error: "Failed to create user profile" }
      }
    }

    // Redirect to verify email page
    redirect(`/verify-email?email=${encodeURIComponent(validatedData.email)}`)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { success: false, error: firstError || "Invalid form data" }
    }

    console.error("Registration error:", error)
    return { success: false, error: "An error occurred during registration" }
  }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password?: string) {
  const supabase = getSupabaseServerActionClient()

  try {
    // Validate input
    const validatedData = loginSchema.parse({ email, password: password || "" })

    if (password) {
      // Password-based login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      })

      if (error) {
        console.error("Error signing in with password:", error)
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Update last_login in users table
        const { error: updateError } = await supabase
          .from("users")
          .update({
            last_login: new Date().toISOString(),
            last_active: new Date().toISOString(),
          })
          .eq("id", data.user.id)

        if (updateError) {
          console.error("Error updating last login:", updateError)
        }

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
    }

    return { success: false, error: "Invalid credentials" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { success: false, error: firstError || "Invalid form data" }
    }

    console.error("Sign in error:", error)
    return { success: false, error: "An unexpected error occurred during sign-in" }
  }
}

// Magic link login
export async function magicLinkLogin(formData: FormData) {
  const email = formData.get("email") as string

  try {
    if (!email) {
      return { success: false, error: "Email is required" }
    }

    // Validate email format
    const emailSchema = z.string().email("Invalid email address")
    const validatedEmail = emailSchema.parse(email)

    const supabase = getSupabaseServerActionClient()

    // Send magic link email
    const { error } = await supabase.auth.signInWithOtp({
      email: validatedEmail,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error("Error sending magic link:", error)
      return { success: false, error: error.message }
    }

    // Redirect to magic link confirmation page
    redirect(`/magic-link-confirmation?email=${encodeURIComponent(validatedEmail)}`)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid email address" }
    }

    console.error("Magic link error:", error)
    return { success: false, error: "An error occurred while sending the magic link" }
  }
}

// Forgot password
export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string

  try {
    if (!email) {
      return { success: false, error: "Email is required" }
    }

    // Validate email format
    const emailSchema = z.string().email("Invalid email address")
    const validatedEmail = emailSchema.parse(email)

    const supabase = getSupabaseServerActionClient()

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(validatedEmail, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    if (error) {
      console.error("Error sending password reset email:", error)
      return { success: false, error: error.message }
    }

    return { success: true, message: "Password reset email sent. Check your inbox." }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid email address" }
    }

    console.error("Forgot password error:", error)
    return { success: false, error: "An error occurred while sending the password reset email" }
  }
}

// Update email
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

// Sign up function (alternative interface)
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
      password: "", // Password is handled by Supabase Auth
      role: "user",
      is_active: true,
      email_verified: false,
    })

    if (insertError) {
      console.error("Error inserting user into public.users:", insertError)
      return { success: false, error: insertError.message }
    }
  }

  return { success: true, user: data.user }
}

// Reset password
export async function resetPassword(password: string) {
  const supabase = getSupabaseServerActionClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error("Error resetting password:", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

// Send password reset email
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

// Update profile
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
