import { signOut } from "@/app/actions/auth-server"
import { redirect } from "next/navigation"

/**
 * Logout page – runs entirely on the server.
 * Immediately signs the user out (invalidates the Supabase session/cookies)
 * and redirects to /login.
 *
 * Because this is a Server Component (no `"use client"`),
 * importing `signOut` (which uses `next/headers`) is safe.
 */
export default async function LogoutPage() {
  // Invoke the server-action – it will perform the redirect.
  await signOut()

  // signOut already calls `redirect("/login")`, but returning a fallback
  // keeps TypeScript happy and prevents “no return” warnings.
  redirect("/login")
}
