"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider" // Assuming this hook exists and provides auth status
import { Loader2 } from "lucide-react"

interface AuthRedirectProps {
  redirectTo?: string
  requireAuth?: boolean
}

export function AuthRedirect({ redirectTo = "/login", requireAuth = true }: AuthRedirectProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth() // Assuming useAuth provides user and isLoading status

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        // If auth is required but no user, redirect to login
        router.push(redirectTo)
      } else if (!requireAuth && user) {
        // If auth is NOT required but user IS logged in, redirect away from auth pages
        router.push("/dashboard") // Or a different default logged-in page
      }
    }
  }, [user, isLoading, router, redirectTo, requireAuth])

  if (isLoading || (requireAuth && !user) || (!requireAuth && user)) {
    // Show a loading spinner or a simple message while redirecting
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    )
  }

  return null // Render nothing if no redirection is needed or while loading
}
