import { NextResponse } from "next/server"
import { shippingConfig } from "@/lib/config"
import { z } from "zod"

const addressValidationSchema = z.object({
  street1: z.string(),
  street2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string(),
})

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = addressValidationSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid address input", details: parsed.error.flatten() }, { status: 400 })
  }

  const addressData = parsed.data

  if (!shippingConfig.enableShippoIntegration || !shippingConfig.shippoApiKey) {
    return NextResponse.json({ error: "Shippo integration is not enabled or API key is missing." }, { status: 500 })
  }

  try {
    const shippoResponse = await fetch("https://api.goshippo.com/addresses/validate/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `ShippoToken ${shippingConfig.shippoApiKey}`,
      },
      body: JSON.stringify(addressData),
    })

    if (!shippoResponse.ok) {
      const errorData = await shippoResponse.json()
      console.error("Shippo address validation error:", errorData)
      return NextResponse.json(
        { error: "Failed to validate address with Shippo", details: errorData },
        { status: shippoResponse.status },
      )
    }

    const shippoData = await shippoResponse.json()

    if (shippoData.validation_results && shippoData.validation_results.is_valid) {
      return NextResponse.json({
        success: true,
        isValid: true,
        normalizedAddress: shippoData.validation_results.normalized_address,
      })
    } else {
      return NextResponse.json({
        success: true,
        isValid: false,
        messages: shippoData.validation_results.messages || ["Address could not be validated."],
      })
    }
  } catch (error) {
    console.error("Server error during address validation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
