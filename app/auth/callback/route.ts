import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"
  const token = requestUrl.searchParams.get("token")
  const type = requestUrl.searchParams.get("type")

  console.log(
    `Auth callback: code=${code ? "present" : "missing"}, token=${
      token ? token.substring(0, 6) + "..." : "missing"
    }, type=${type}, next=${next}`,
  )
  console.log("Full search params:", Object.fromEntries(requestUrl.searchParams.entries()))

  // If we have a token but no code, this is likely from our v1/verify endpoint
  if (token) {
    // Construct the URL with the token and other parameters
    const redirectUrl = new URL(next, requestUrl.origin)

    // Copy all search parameters to the redirect URL
    requestUrl.searchParams.forEach((value, key) => {
      if (key !== "next") {
        redirectUrl.searchParams.set(key, value)
      }
    })

    console.log(`Redirecting with token to: ${redirectUrl.toString()}`)
    return NextResponse.redirect(redirectUrl)
  }

  // If we have a code, this is a standard OAuth callback
  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(
          new URL(`/auth-error?error=${encodeURIComponent(error.message)}`, requestUrl.origin),
        )
      }

      console.log(`Successfully exchanged code for session, redirecting to: ${next}`)
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    } catch (error) {
      console.error("Unexpected error in auth callback:", error)
      return NextResponse.redirect(
        new URL(`/auth-error?error=${encodeURIComponent("An unexpected error occurred")}`, requestUrl.origin),
      )
    }
  }

  // If we have neither a token nor a code, redirect to an error page
  console.error("No token or code found in callback")
  return NextResponse.redirect(new URL("/auth-error?error=missing_parameters", requestUrl.origin))
}
