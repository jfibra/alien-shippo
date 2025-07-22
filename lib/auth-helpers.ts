"use client"

import { redirect } from "next/navigation"
import { supabase } from "./supabase-browser"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Parse and handle auth tokens from URL
export async function handleAuthTokens(searchParams: URLSearchParams) {
  const accessToken = searchParams.get("access_token")
  const refreshToken = searchParams.get("refresh_token")
  const type = searchParams.get("type")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  // If there's an error in the URL, return it
  if (error) {
    return {
      success: false,
      error,
      errorDescription,
      type,
    }
  }

  // If no tokens are present, return early
  if (!accessToken || !refreshToken) {
    return {
      success: false,
      error: "missing_tokens",
      errorDescription: "No authentication tokens found in URL",
      type,
    }
  }

  try {
    // Set the session using the tokens
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (error) {
      return {
        success: false,
        error: "invalid_tokens",
        errorDescription: error.message,
        type,
      }
    }

    return {
      success: true,
      type,
    }
  } catch (err) {
    return {
      success: false,
      error: "unexpected_error",
      errorDescription: err instanceof Error ? err.message : "An unexpected error occurred",
      type,
    }
  }
}

// Redirect based on auth result
export function handleAuthRedirect(result: {
  success: boolean
  type?: string | null
  error?: string
  errorDescription?: string
}) {
  if (result.success) {
    // Handle successful auth based on type
    switch (result.type) {
      case "signup":
      case "recovery":
      case "invite":
      case "magiclink":
        redirect("/dashboard")
      case "email_change":
        redirect("/email-change-confirmed")
      default:
        redirect("/dashboard")
    }
  } else {
    // For errors, redirect to appropriate error page with query params
    redirect(
      `/auth-error?error=${result.error || "unknown"}&description=${result.errorDescription || ""}&type=${result.type || "unknown"}`,
    )
  }
}

// Function to resend verification email
export async function resendVerificationEmail(email: string) {
  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    })

    return {
      success: !error,
      error: error?.message,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    }
  }
}

// Function to resend password reset email
export async function resendPasswordResetEmail(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    return {
      success: !error,
      error: error?.message,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    }
  }
}

// This helper is primarily for API routes or server components
// where you need to interact with Supabase Auth directly.
export function getSupabaseRouteHandlerClient() {
  const cookieStore = cookies()
  return createRouteHandlerClient({ cookies: () => cookieStore })
}
