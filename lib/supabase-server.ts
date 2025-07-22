import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cache } from "react"
import { supabaseConfig } from "./config"
import type { Database } from "@/types/supabase" // Assuming you have this type

// Mock server-side Supabase client for dashboard demo
export function createServerSupabaseClient() {
  // Return mock client with basic methods
  return {
    auth: {
      getUser: async () => ({
        data: {
          user: {
            id: "mock_user_1",
            email: "demo@alienshipper.com",
            user_metadata: { name: "Demo User" },
          },
        },
        error: null,
      }),
    },
    from: (table: string) => ({
      select: () => ({
        data: [],
        error: null,
      }),
      insert: () => ({
        data: null,
        error: null,
      }),
      update: () => ({
        data: null,
        error: null,
      }),
      delete: () => ({
        data: null,
        error: null,
      }),
    }),
  }
}

export interface UserProfile {
  id: string
  email: string
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  full_name: string
  role: string
  profile_image_url: string | null
}

export const createClient = cache(() => {
  const cookieStore = cookies()

  return createServerClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have enabled the `splitCookies: true` option in your Supabase client.
          // console.error("Error setting cookie in server component:", error);
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `remove` method was called from a Server Component.
          // This can be ignored if you have enabled the `splitCookies: true` option in your Supabase client.
          // console.error("Error removing cookie in server component:", error);
        }
      },
    },
  })
})

export async function getSession() {
  const supabase = createClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = createClient()
  try {
    const { data: sessionUser } = await supabase.auth.getUser()
    if (!sessionUser?.user) {
      return null
    }

    // Fetch additional user profile data from your public.users table
    const { data, error } = await supabase
      .from("users") // Query your public.users table
      .select(`id, email, first_name, middle_name, last_name, full_name, role, profile_image_url`)
      .eq("id", sessionUser.user.id) // Match by auth.users ID
      .single()

    if (error) {
      console.error("Error fetching user profile from public.users:", error)
      return null
    }

    return data as UserProfile
  } catch (error) {
    console.error("Unexpected error fetching user profile:", error)
    return null
  }
}

export async function getSubscription() {
  const supabase = createClient()
  try {
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .single()

    if (error && error.details?.includes("0 rows")) {
      return null
    }
    if (error) {
      throw error
    }
    return subscription
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return null
  }
}
