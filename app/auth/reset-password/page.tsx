"use client"

import type React from "react"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function ResetPasswordAuthPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string; token?: string; type?: string }
}) {
  const { token, type, error, message } = searchParams
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
        remove: (name: string, options: any) => cookieStore.set(name, "", options),
      },
    },
  )

  // Check if the user is already logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  let displayMessage = message || "Please enter your new password."
  let displayError = error

  // If there's a token and type, it means the user came from a reset password email
  if (token && type === "recovery") {
    // This page will handle the actual password reset form
    // The form itself will call supabase.auth.updateUser({ password: newPassword })
    // We don't verify the token here, as it's handled by the client-side form submission
    // and Supabase's `updateUser` method which implicitly uses the session from the token.
  } else if (!token || type !== "recovery") {
    displayError = "Invalid or expired password reset link."
    displayMessage = "Please request a new password reset link."
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className={displayError ? "text-red-600" : "text-gray-800"}>
            {displayError ? "Password Reset Error" : "Reset Your Password"}
          </CardTitle>
          <CardDescription>{displayMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              <p>{displayError}</p>
            </div>
          )}
          {token && type === "recovery" ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/forgot-password">Request New Link</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/login">Back to Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// This component would be in components/reset-password-form.tsx
// It's included here for context, but should be imported.
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { resetPassword } from "@/lib/auth" // Assuming this action exists
import { Swal } from "@/components/sweet-alert"
import { useRouter } from "next/navigation"

function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setIsLoading(true)
    try {
      // Supabase's updateUser with password handles the token implicitly from the session
      const result = await resetPassword(password)

      if (result.success) {
        Swal.success(
          "Password Reset",
          "Your password has been successfully updated. You can now log in with your new password.",
        )
        router.push("/login")
      } else {
        setError(result.error || "Failed to reset password. Please try again.")
        Swal.error("Reset Failed", result.error || "Failed to reset password.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
      Swal.error("Reset Failed", err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pr-10"
            placeholder="••••••••"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full"
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  )
}
