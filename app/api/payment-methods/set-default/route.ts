import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"

const setDefaultPaymentMethodSchema = z.object({
  id: z.string().uuid(),
})

export async function POST(request: Request) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = setDefaultPaymentMethodSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
  }

  const { id } = parsed.data

  try {
    // Start a transaction or ensure atomicity if possible
    // 1. Unset current default for this user
    await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", user.id).eq("is_default", true)

    // 2. Set the specified payment method as default
    const { error } = await supabase
      .from("payment_methods")
      .update({ is_default: true })
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user owns the payment method

    if (error) {
      console.error("Error setting default payment method in DB:", error)
      return NextResponse.json({ error: "Failed to set default payment method" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Default payment method updated successfully." })
  } catch (error) {
    console.error("Server error setting default payment method:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
