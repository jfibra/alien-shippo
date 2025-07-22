import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"

const deletePaymentMethodSchema = z.object({
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
  const parsed = deletePaymentMethodSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
  }

  const { id } = parsed.data

  try {
    // In a real application, you might also call the payment gateway API to delete the payment method.

    const { error } = await supabase.from("payment_methods").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("Error deleting payment method from DB:", error)
      return NextResponse.json({ error: "Failed to delete payment method" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Payment method deleted successfully." })
  } catch (error) {
    console.error("Server error deleting payment method:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
