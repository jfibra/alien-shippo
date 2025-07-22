import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

/**
 * Exchanges the `code` param for a Supabase session, then
 * sends the user to the dashboard.
 *
 * Final URL in Supabase email:  https://your-site.com/auth/magic/callback
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL("/dashboard", url))
}
