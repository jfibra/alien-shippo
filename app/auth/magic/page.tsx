import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function MagicLinkPage({
  searchParams,
}: {
  searchParams: { token_hash?: string; type?: string; next?: string }
}) {
  const { token_hash, type, next = "/dashboard" } = searchParams
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

  let message = "Processing magic link..."
  let isSuccess = false
  let error = null

  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type === "magiclink" ? "magiclink" : "signup", // Ensure type is correct
    })

    if (!verifyError) {
      isSuccess = true
      message = "Successfully logged in via magic link!"
      // Redirect to the dashboard after a short delay or immediately
      redirect(next)
    } else {
      error = verifyError.message
      message = `Failed to log in: ${error}`
    }
  } else {
    error = "Invalid token or type provided."
    message = "Invalid magic link."
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className={isSuccess ? "text-green-600" : "text-red-600"}>
            {isSuccess ? "Login Successful!" : "Login Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              <p>{error}</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
            {isSuccess && (
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href={next}>Go to Dashboard</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
