import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
      remove: (name: string, options: any) => cookieStore.set(name, "", options),
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const body = await request.json()

    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        subject,
        message,
        status: "new",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating contact message:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in contact API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
