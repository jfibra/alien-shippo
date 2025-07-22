"use client"

import { supabase } from "@/lib/supabase-browser"
import type { User } from "@supabase/supabase-js"

/* -------------------------------------------------------------------------- */
/*                              Helper utilities                              */
/* -------------------------------------------------------------------------- */

function origin() {
  // Guards against SSR ‒ window is only defined in the browser
  return typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL ?? "")
}

function userFullName(first: string, middle: string | null, last: string) {
  return `${first} ${middle ? middle + " " : ""}${last}`
}

/* -------------------------------------------------------------------------- */
/*                                 Sign-up                                    */
/* -------------------------------------------------------------------------- */
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
          full_name: userFullName(firstName, middleName, lastName),
        },
        emailRedirectTo: `${origin()}/auth/magic/callback`,
      },
    })

    if (error) {
      const msg = error.message.includes("User already registered")
        ? "This email is already registered. Please log in instead."
        : error.message
      return { success: false, error: msg }
    }

    // Create a row in public.users – password column left empty because Supabase Auth stores it
    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email!,
        password: "",
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        role: "user",
        email_verified: false,
        is_active: true,
      })
    }

    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err?.message ?? "Unexpected error" }
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Login                                    */
/* -------------------------------------------------------------------------- */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) throw error

    // Update last_login timestamp
    if (data.user) {
      await supabase
        .from("users")
        .update({ last_login: new Date().toISOString(), last_active: new Date().toISOString() })
        .eq("id", data.user.id)
    }

    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err?.message ?? "Invalid credentials" }
  }
}

/* -------------------------------------------------------------------------- */
/*                               Magic Link / OTP                             */
/* -------------------------------------------------------------------------- */
export async function sendMagicLink(email: string) {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${origin()}/auth/magic/callback`,
      },
    })
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? "Unable to send magic link" }
  }
}

/* -------------------------------------------------------------------------- */
/*                             Forgot / Reset Password                        */
/* -------------------------------------------------------------------------- */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin()}/auth/reset-password/callback`,
    })
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? "Unable to send reset email" }
  }
}

export async function updatePassword(password: string) {
  try {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? "Unable to update password" }
  }
}

/* -------------------------------------------------------------------------- */
/*                          Profile / Email management                        */
/* -------------------------------------------------------------------------- */
export async function updateProfile(data: Record<string, unknown>) {
  try {
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()

    if (userErr || !user) throw userErr ?? new Error("No authenticated user")

    const { error } = await supabase
      .from("users")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", user.id)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? "Unable to update profile" }
  }
}

export async function updateEmail(email: string) {
  try {
    const { error } = await supabase.auth.updateUser({ email })
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? "Unable to update email" }
  }
}

/* -------------------------------------------------------------------------- */
/*                            Verification email helpers                      */
/* -------------------------------------------------------------------------- */
export async function resendVerificationEmail() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user?.email) throw error ?? new Error("No user email")

    const { error: resendErr } = await supabase.auth.resend({ type: "signup", email: user.email })
    if (resendErr) throw resendErr

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? "Unable to resend verification email" }
  }
}

export async function triggerVerificationEmail() {
  // Alias for compatibility
  return resendVerificationEmail()
}

/* -------------------------------------------------------------------------- */
/*                               Session helpers                              */
/* -------------------------------------------------------------------------- */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? "Error signing out" }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (err) {
    console.error("getCurrentUser:", err)
    return null
  }
}
