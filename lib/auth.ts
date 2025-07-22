"use client"

import { supabase } from "@/lib/supabase-browser"
import type { User } from "@supabase/supabase-js"

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  middleName: string | null,
  lastName: string,
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          full_name: `${firstName} ${middleName ? middleName + " " : ""}${lastName}`,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      if (error.message.includes("User already registered")) {
        return {
          success: false,
          error: "This email is already registered. Please log in instead.",
          code: "email_already_exists",
        }
      }
      throw error
    }

    // Create user profile in public.users table
    if (data.user) {
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email!,
          password: "", // Password is handled by Supabase Auth
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          role: "user",
          email_verified: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      if (profileError) {
        console.error("Profile creation error:", profileError)
      }
    }

    return { success: true, data, error: null }
  } catch (error: any) {
    return { success: false, data: null, error: error.message }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    // Update last_login in users table
    if (data.user) {
      await supabase
        .from("users")
        .update({
          last_login: new Date().toISOString(),
          last_active: new Date().toISOString(),
        })
        .eq("id", data.user.id)
    }

    return { success: true, data, error: null }
  } catch (error: any) {
    return { success: false, data: null, error: error.message }
  }
}

export async function sendMagicLink(email: string) {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/magic`,
        shouldCreateUser: true,
      },
    })

    if (error) {
      throw error
    }

    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err.message ?? "An unexpected error occurred" }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      throw error
    }

    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updatePassword(password: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      throw error
    }

    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Additional auth functions
export async function updateProfile(data: any) {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error("No authenticated user")

    const { error } = await supabase
      .from("users")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.user.id)

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateEmail(email: string) {
  try {
    const { error } = await supabase.auth.updateUser({ email })
    if (error) throw error

    return { success: true, email }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function resendVerificationEmail() {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user?.email) throw new Error("No user email found")

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user.user.email,
    })

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function triggerVerificationEmail() {
  return resendVerificationEmail()
}

export { supabase }
