import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"
import ResetPasswordForm from "@/components/reset-password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

/**
 * Password-reset page (Server Component).
 * We do all Supabase and cookie work here, then render a nested
 * <ResetPasswordForm /> which is a Client Component.
 */
export default async function ResetPasswordPage({
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
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, opts) => cookieStore.set(name, value, opts),
        remove: (name, opts) => cookieStore.set(name, "", opts),
      },
    },
  )

  // If already logged in, go straight to the dashboard.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) redirect("/dashboard")

  // Decide what message to show.
  let displayMessage = message || "Please enter your new password."
  let displayError = error
  if (!token || type !== "recovery") {
    displayError = "Invalid or expired password-reset link."
    displayMessage = "Please request a new password-reset link."
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

        <CardContent>
          {displayError ? (
            <div className="flex flex-col gap-4">
              <Button asChild className="w-full">
                <Link href="/forgot-password">Request New Link</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/login">Back to Login</Link>
              </Button>
            </div>
          ) : (
            token &&
            type === "recovery" && (
              // <ResetPasswordForm /> is **client-side**; keeps interactive logic there.
              <ResetPasswordForm token={token} />
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}
