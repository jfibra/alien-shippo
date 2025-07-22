"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Server-action that destroys the Supabase session cookie
 * and redirects the user to /login.
 */
export async function signOut() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, opts) => cookieStore.set(name, value, opts),
        remove: (name, opts) => cookieStore.set(name, "", opts),
      },
    },
  )

  await supabase.auth.signOut()
  redirect("/login")
}
