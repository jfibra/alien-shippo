import Link from "next/link"
import type { Metadata } from "next"
import { ResetPasswordForm } from "@/components/reset-password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthLayout } from "@/components/auth-layout"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Reset Password - Viking Freight",
  description: "Set a new password for your Viking Freight account.",
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string; type?: string; error?: string; message?: string }
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

  let displayMessage = message || "Enter your new password below."
  let displayError = error

  // If there's a token and type, it means the user came from a reset password email
  if (token && type === "recovery") {
    // This page will handle the actual password reset form
    // The form itself will call supabase.auth.updateUser({ password: newPassword })
    // We don't verify the token here, as it's handled by the client-side form submission
    // and Supabase's `updateUser` method which implicitly uses the session from the token.
  } else {
    displayError = "Invalid or expired password reset link."
    displayMessage = "Please request a new password reset link."
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>{displayMessage}</CardDescription>
        </CardHeader>
        <CardContent>
          {displayError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
              <p>{displayError}</p>
            </div>
          )}
          {token && type === "recovery" ? (
            <ResetPasswordForm />
          ) : (
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                If you need a new link, please go to the{" "}
                <Link href="/forgot-password" className="font-medium text-gold hover:underline">
                  Forgot Password
                </Link>{" "}
                page.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
