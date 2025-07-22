import { NextResponse } from "next/server"
import { paymentConfig } from "@/lib/config"

export async function POST(request: Request) {
  const { amount } = await request.json()

  if (!amount) {
    return NextResponse.json({ error: "Amount is required" }, { status: 400 })
  }

  if (!paymentConfig.paypalClientId || !paymentConfig.paypalSecretKey) {
    return NextResponse.json({ error: "PayPal API keys are not configured." }, { status: 500 })
  }

  try {
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
      return NextResponse.json({ error: "Failed to authenticate with PayPal" }, { status: authResponse.status })
    }

    const { access_token } = await authResponse.json()

    const orderResponse = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toFixed(2),
            },
          },
        ],
      }),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      console.error("PayPal Order Creation Error:", errorData)
      return NextResponse.json({ error: "Failed to create PayPal order" }, { status: orderResponse.status })
    }

    const orderData = await orderResponse.json()
    return NextResponse.json({ orderId: orderData.id })
  } catch (error) {
    console.error("Server error during PayPal order creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
