import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { shippingConfig } from "@/lib/config"
import { z } from "zod"

const createShipmentSchema = z.object({
  address_from: z.object({
    name: z.string().optional(),
    street1: z.string(),
    street2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  address_to: z.object({
    name: z.string().optional(),
    street1: z.string(),
    street2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  parcel: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
    distance_unit: z.enum(["in", "cm"]),
    weight: z.number(),
    mass_unit: z.enum(["lb", "oz", "g", "kg"]),
  }),
  carrier_account: z.string().optional(), // For specific carrier accounts
  servicelevel_token: z.string(), // The chosen service level token from rates
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Shipment request body:", body) // Debug log

    // Validate input using Zod schema
    const parsed = createShipmentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    const { address_from, address_to, parcel, servicelevel_token, carrier_account } = parsed.data

    // Get the Supabase client
    const supabase = createServerSupabaseClient()

    // Get user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError.message)
      return NextResponse.json({ error: "Unauthorized", details: sessionError.message }, { status: 401 })
    }

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized", details: "No user session found" }, { status: 401 })
    }

    const userId = session.user.id

    // Check user's balance before proceeding
    const { data: accountData, error: accountError } = await supabase
      .from("user_accounts")
      .select("balance")
      .eq("user_id", userId)
      .single()

    if (accountError && accountError.code !== "PGRST116") {
      console.error("Error checking user account:", accountError)
      return NextResponse.json({ error: "Failed to check account balance" }, { status: 500 })
    }

    // If no account exists or balance is null, treat as zero balance
    const currentBalance = accountData?.balance || 0
    const shipmentCost = Number.parseFloat(body.rate) || 0

    // Check if user has sufficient balance
    if (currentBalance < shipmentCost) {
      return NextResponse.json(
        {
          error: "Insufficient balance",
          message: `Your current balance ($${currentBalance.toFixed(2)}) is less than the shipment cost ($${shipmentCost.toFixed(2)}). Please add funds to your account.`,
          currentBalance,
          requiredAmount: shipmentCost,
        },
        { status: 400 },
      )
    }

    // Create from address if needed
    let fromAddressId = body.fromAddressId
    if (fromAddressId === "new" || (body.saveFromAddress && fromAddressId === "new")) {
      const { data: fromAddress, error: fromAddressError } = await supabase
        .from("addresses")
        .insert({
          user_id: userId,
          name: address_from.name,
          company_name: address_from.company || null,
          address_line1: address_from.street1,
          address_line2: address_from.street2 || null,
          city: address_from.city,
          state: address_from.state,
          postal_code: address_from.zip,
          country: address_from.country,
          email: address_from.email || null,
          company: address_from.company || null,
          is_residential: true,
          address_type: "both",
          is_default: false,
          is_deleted: false,
        })
        .select("id")
        .single()

      if (fromAddressError) {
        console.error("Error creating from address:", fromAddressError)
        return NextResponse.json({ error: "Failed to create from address" }, { status: 500 })
      }

      fromAddressId = fromAddress.id
    }

    // Create to address if needed
    let toAddressId = body.toAddressId
    if (toAddressId === "new" || (body.saveToAddress && toAddressId === "new")) {
      const { data: toAddress, error: toAddressError } = await supabase
        .from("addresses")
        .insert({
          user_id: userId,
          name: address_to.name,
          company_name: address_to.company || null,
          address_line1: address_to.street1,
          address_line2: address_to.street2 || null,
          city: address_to.city,
          state: address_to.state,
          postal_code: address_to.zip,
          country: address_to.country,
          email: address_to.email || null,
          company: address_to.company || null,
          is_residential: true,
          address_type: "shipping",
          is_default: false,
          is_deleted: false,
        })
        .select("id")
        .single()

      if (toAddressError) {
        console.error("Error creating to address:", toAddressError)
        return NextResponse.json({ error: "Failed to create to address" }, { status: 500 })
      }

      toAddressId = toAddress.id
    }

    // First, check if we need to create a rate record
    let rateId = null
    if (body.rateId) {
      // Check if the rate exists
      const { data: existingRate, error: rateCheckError } = await supabase
        .from("rates")
        .select("id")
        .eq("id", body.rateId)
        .single()

      if (rateCheckError || !existingRate) {
        console.log("Rate not found, creating a new rate record")

        // Create a new rate record - store service name in a separate field
        const { data: newRate, error: rateError } = await supabase
          .from("rates")
          .insert({
            service_id: null, // Set to null instead of using the string value
            service_name: body.service || "Unknown Service", // Store the service name as a string
            package_type_id: null, // Set to null instead of using the string value
            package_type_name: body.packageType || "Unknown Package", // Store the package type as a string
            rate_amount: body.rate,
            currency: "USD",
            delivery_days: body.estimatedDays || null,
          })
          .select("id")
          .single()

        if (rateError) {
          console.error("Error creating rate:", rateError)
          // Continue without a rate_id
        } else {
          rateId = newRate.id
        }
      } else {
        rateId = existingRate.id
      }
    }

    // Make sure we set a default status if none is provided
    const shipmentStatus = body.status || "created"

    // Create shipment in database
    const shipmentData = {
      user_id: userId,
      from_address_id: fromAddressId,
      to_address_id: toAddressId,
      carrier: body.carrier,
      service: body.service, // Store the service name directly
      service_name: body.service, // Duplicate for clarity
      package_type: body.packageType || null, // Store the package type directly
      weight_oz: (Number.parseFloat(body.weightLb) || 0) * 16 + (Number.parseFloat(body.weightOz) || 0),
      dimensions:
        body.length && body.width && body.height
          ? {
              length: Number.parseFloat(body.length) || 0,
              width: Number.parseFloat(body.width) || 0,
              height: Number.parseFloat(body.height) || 0,
            }
          : null,
      total_cost: body.rate,
      currency: "USD",
      status: shipmentStatus,
      tracking_number: `TEST${Math.floor(Math.random() * 1000000000)
        .toString()
        .padStart(9, "0")}`,
      label_url: null,
      rate_id: rateId,
      // Add these fields from the form
      is_non_machinable: body.nonMachinable === true || body.nonMachinable === "true" || false,
      contents_type: body.contents || "merchandise",
      customs_value: body.customsValue ? Number.parseFloat(body.customsValue) : null,
      insurance_type: body.insurance || "none",
      require_signature: body.requireSignature === true || body.requireSignature === "true" || false,
      has_return_label: false,
    }

    console.log("Creating shipment with data:", shipmentData) // Debug log

    try {
      const { data: shipment, error: shipmentError } = await supabase
        .from("shipments")
        .insert(shipmentData)
        .select("id")
        .single()

      if (shipmentError) {
        console.error("Error creating shipment:", shipmentError)
        return NextResponse.json(
          { error: "Failed to create shipment", details: shipmentError.message },
          { status: 500 },
        )
      }

      // Create initial tracking event
      try {
        await supabase.from("tracking_events").insert({
          shipment_id: shipment.id,
          status: "created",
          timestamp: new Date().toISOString(),
          description: "Shipment created",
          location: "System",
        })
      } catch (trackingError) {
        console.error("Error creating tracking event:", trackingError)
        // Continue even if tracking event creation fails
      }

      // Handle international shipment with customs if needed
      try {
        const { data: toAddress } = await supabase.from("addresses").select("country").eq("id", toAddressId).single()

        if (toAddress && toAddress.country !== "US" && shipmentData.customs_value) {
          await supabase.from("customs_declarations").insert({
            shipment_id: shipment.id,
            contents_type: shipmentData.contents_type,
            customs_value: shipmentData.customs_value,
            currency: shipmentData.currency,
            description: `Shipment contents: ${shipmentData.contents_type}`,
          })
        }
      } catch (customsError) {
        console.error("Error creating customs declaration:", customsError)
        // Continue even if customs declaration creation fails
      }

      // Deduct funds from user account
      try {
        const { error: deductError } = await supabase.rpc("deduct_funds", {
          user_id_param: userId,
          amount_param: body.rate,
          currency_param: "USD",
        })

        if (deductError) {
          console.error("Error deducting funds:", deductError)

          // If we can't deduct funds, we should delete the shipment we just created
          try {
            await supabase.from("shipments").delete().eq("id", shipment.id)
          } catch (deleteError) {
            console.error("Error deleting shipment after failed payment:", deleteError)
          }

          return NextResponse.json({ error: "Failed to deduct funds from account" }, { status: 500 })
        }
      } catch (error) {
        console.error("Exception deducting funds:", error)
        return NextResponse.json({ error: "Exception deducting funds from account" }, { status: 500 })
      }

      // Record transaction
      try {
        await supabase.from("transactions").insert({
          user_id: userId,
          shipment_id: shipment.id,
          amount: body.rate,
          status: "completed",
          provider: "account_balance",
          transaction_reference: `ship_${shipment.id}`,
        })
      } catch (transactionError) {
        console.error("Error recording transaction:", transactionError)
        // Continue even if transaction recording fails
      }

      // Create a notification for the user
      try {
        await supabase.from("notifications").insert({
          user_id: userId,
          title: "Shipment Created",
          message: `Your shipment has been created successfully. Tracking number: ${shipmentData.tracking_number}`,
          type: "shipment_created",
          is_read: false,
        })
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Continue even if notification creation fails
      }

      // Integrate with Shippo if enabled
      if (shippingConfig.enableShippoIntegration && shippingConfig.shippoApiKey) {
        const shippoResponse = await fetch("https://api.goshippo.com/shipments/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `ShippoToken ${shippingConfig.shippoApiKey}`,
          },
          body: JSON.stringify({
            address_from,
            address_to,
            parcels: [parcel],
            carrier_accounts: carrier_account ? [carrier_account] : undefined,
            servicelevel_token,
            async: false, // Request synchronous label creation
          }),
        })

        if (!shippoResponse.ok) {
          const errorData = await shippoResponse.json()
          console.error("Shippo shipment creation error:", errorData)
          return NextResponse.json(
            { error: "Failed to create shipment with Shippo", details: errorData },
            { status: shippoResponse.status },
          )
        }

        const shippoData = await shippoResponse.json()
        return NextResponse.json({ success: true, shipment: shippoData })
      }

      return NextResponse.json({
        success: true,
        shipmentId: shipment.id,
        message: "Shipment created successfully",
      })
    } catch (error) {
      console.error("Error in shipment creation process:", error)
      return NextResponse.json(
        {
          error: "Failed to create shipment",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error creating shipment:", error)
    // Ensure we always return valid JSON
    return NextResponse.json(
      {
        error: "Failed to create shipment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
