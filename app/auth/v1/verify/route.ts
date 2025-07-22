import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const { searchParams } = requestUrl
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type")
  const next = searchParams.get("next") || "/dashboard"

  if (token_hash && type) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as any }) // Cast type to any if needed

    if (!error) {
      return NextResponse.redirect(requestUrl.origin + next)
    } else {
      console.error("Error verifying OTP:", error)
      return NextResponse.redirect(requestUrl.origin + `/auth-error?message=${encodeURIComponent(error.message)}`)
    }
  }

  return NextResponse.redirect(requestUrl.origin + "/auth-error?message=Invalid verification link.")
}
