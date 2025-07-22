import { NextResponse } from "next/server"
import { paymentConfig } from "@/lib/config"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

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

  const { amount, paymentMethodId, paypalOrderId, description } = await request.json()

  if (!amount || (!paymentMethodId && !paypalOrderId)) {
    return NextResponse.json({ error: "Amount and a payment method or PayPal order ID are required" }, { status: 400 })
  }

  let transactionStatus = "failed"
  let transactionDescription = description || "Payment for services"
  let transactionType = "debit" // Assuming this is for a payment out

  try {
    if (
      paypalOrderId &&
      paymentConfig.enablePaypalPayments &&
      paymentConfig.paypalClientId &&
      paymentConfig.paypalSecretKey
    ) {
      // Process PayPal capture
      const authResponse = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${paymentConfig.paypalClientId}:${paymentConfig.paypalSecretKey}`).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      })

      if (!authResponse.ok) {
        const errorData = await authResponse.json()
        console.error("PayPal Auth Error:", errorData)
        throw new Error("Failed to authenticate with PayPal for capture.")
      }
      const { access_token } = await authResponse.json()

      const captureResponse = await fetch(
        `https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}/capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      )

      if (!captureResponse.ok) {
        const errorData = await captureResponse.json()
        console.error("PayPal Capture Error:", errorData)
        throw new Error("Failed to capture PayPal payment.")
      }

      const captureData = await captureResponse.json()
      if (captureData.status === "COMPLETED") {
        transactionStatus = "completed"
        transactionDescription = `PayPal payment for order ${paypalOrderId}`
        transactionType = "credit" // Funds added to user's balance
      } else {
        transactionStatus = "pending" // Or other status based on PayPal response
        transactionDescription = `PayPal payment pending for order ${paypalOrderId}`
      }
    } else if (paymentMethodId) {
      // Simulate processing with a generic payment method
      // In a real app, you'd call Stripe/other gateway API here
      console.log(`Processing payment of ${amount} using payment method ${paymentMethodId}`)
      // Mock success
      transactionStatus = "completed"
      transactionDescription = `Payment via card ending in ${paymentMethodId.slice(-4)}`
    } else {
      throw new Error("No valid payment method or PayPal order ID provided.")
    }

    // Record transaction in database
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        amount: amount,
        currency: "USD",
        type: transactionType,
        status: transactionStatus,
        description: transactionDescription,
        payment_method_id: paymentMethodId || null,
        external_id: paypalOrderId || null, // Store PayPal order ID
      })
      .select()
      .single()

    if (transactionError) {
      console.error("Error recording transaction:", transactionError)
      throw new Error("Failed to record transaction.")
    }

    // Update user balance if transaction completed
    if (transactionStatus === "completed") {
      const { error: balanceError } = await supabase.rpc("add_funds", {
        p_user_id: user.id,
        p_amount: amount,
      })

      if (balanceError) {
        console.error("Error updating user balance:", balanceError)
        // Consider rolling back transaction or marking it for review
        return NextResponse.json(
          { success: false, error: "Payment processed but balance update failed." },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({ success: true, transaction, message: "Payment processed successfully." })
  } catch (error: any) {
    console.error("Payment processing server error:", error)
    // Record a failed transaction if possible
    await supabase.from("transactions").insert({
      user_id: user.id,
      amount: amount,
      currency: "USD",
      type: transactionType,
      status: "failed",
      description: `Failed payment: ${error.message || "Unknown error"}`,
      payment_method_id: paymentMethodId || null,
      external_id: paypalOrderId || null,
    })
    return NextResponse.json({ success: false, error: error.message || "Failed to process payment." }, { status: 500 })
  }
}
