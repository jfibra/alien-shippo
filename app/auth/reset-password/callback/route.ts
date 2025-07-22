import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

/**
 * Exchanges the `code` param for a Supabase session, then
 * routes the user to the password-reset page that shows the “set new password” form.
 *
 * Final URL in Supabase email:  https://your-site.com/auth/reset-password/callback
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL("/auth/reset-password?stage=set-new", url))
}
