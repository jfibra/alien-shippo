import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"

const addPaymentMethodSchema = z.object({
  card_number: z.string().min(13).max(19),
  exp_month: z.string().length(2),
  exp_year: z.string().length(4),
  cvc: z.string().min(3).max(4),
  billing_zip: z.string().min(5).max(10),
  is_default: z.boolean().optional().default(false),
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
  const parsed = addPaymentMethodSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
  }

  const { card_number, exp_month, exp_year, cvc, billing_zip, is_default } = parsed.data

  // In a real application, you would integrate with a payment gateway (e.g., Stripe, PayPal) here
  // to tokenize the card and get a payment method ID.
  // For this mock, we'll simulate a successful tokenization.
  const mockPaymentMethodId = `pm_${Math.random().toString(36).substring(2, 15)}`
  const last4 = card_number.slice(-4)
  const cardBrand = "Visa" // Mocked

  try {
    // If setting as default, first unset all other default payment methods for this user
    if (is_default) {
      await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", user.id).eq("is_default", true)
    }

    const { data, error } = await supabase.from("payment_methods").insert({
      user_id: user.id,
      provider: "mock_stripe", // Or actual provider like 'stripe', 'paypal'
      token: mockPaymentMethodId,
      last_four: last4,
      brand: cardBrand,
      exp_month: Number.parseInt(exp_month),
      exp_year: Number.parseInt(exp_year),
      is_default: is_default,
      billing_zip: billing_zip,
    })

    if (error) {
      console.error("Error adding payment method to DB:", error)
      return NextResponse.json({ error: "Failed to add payment method" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Payment method added successfully." })
  } catch (error) {
    console.error("Server error adding payment method:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
