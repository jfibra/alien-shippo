import { type NextRequest, NextResponse } from "next/server"

interface ShippingRequest {
  fromZip: string
  toZip: string
  weight: string
  packageType: string
  length?: string
  width?: string
  height?: string
}

interface ShippoRate {
  object_id: string
  amount: string
  currency: string
  provider: string
  servicelevel: {
    name: string
    terms: string
  }
  estimated_days: number
  duration_terms: string
  messages?: Array<{ text: string; code: string }>
}

interface ShippingRate {
  id: string
  carrier: string
  service: string
  rate: number
  estimated_days?: number
  duration_terms?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ShippingRequest = await request.json()
    const { fromZip, toZip, weight, packageType, length, width, height } = body

    // Validate required fields
    if (!fromZip || !toZip || !weight || !packageType) {
      return NextResponse.json(
        { error: "Missing required fields: fromZip, toZip, weight, packageType" },
        { status: 400 },
      )
    }

    // Validate ZIP codes
    const zipRegex = /^\d{5}(-\d{4})?$/
    if (!zipRegex.test(fromZip.trim()) || !zipRegex.test(toZip.trim())) {
      return NextResponse.json({ error: "Invalid ZIP code format" }, { status: 400 })
    }

    // Validate weight
    const weightNum = Number.parseFloat(weight)
    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 150) {
      return NextResponse.json({ error: "Weight must be between 0.1 and 150 lbs" }, { status: 400 })
    }

    // Get Shippo API key
    const shippoApiKey = process.env.SHIPPO_API_KEY
    if (!shippoApiKey) {
      console.error("SHIPPO_API_KEY not configured")
      return NextResponse.json({ error: "Shipping service not configured" }, { status: 500 })
    }

    // Set package dimensions based on type
    let packageDimensions = {
      length: "12",
      width: "8",
      height: "6",
    }

    // Handle predefined package types
    switch (packageType) {
      case "small_flat_rate_box":
        packageDimensions = { length: "8.625", width: "5.375", height: "1.625" }
        break
      case "medium_flat_rate_box":
        packageDimensions = { length: "11", width: "8.5", height: "5.5" }
        break
      case "large_flat_rate_box":
        packageDimensions = { length: "12", width: "12", height: "5.5" }
        break
      case "regional_a":
        packageDimensions = { length: "10.125", width: "7.125", height: "5" }
        break
      case "regional_b":
        packageDimensions = { length: "12", width: "10.25", height: "5" }
        break
      case "ups_small_box":
        packageDimensions = { length: "13", width: "11", height: "2" }
        break
      case "ups_medium_box":
        packageDimensions = { length: "16", width: "11", height: "3" }
        break
      case "ups_large_box":
        packageDimensions = { length: "18", width: "13", height: "3" }
        break
      case "custom":
        if (length && width && height) {
          packageDimensions = { length, width, height }
        }
        break
      case "letter":
        packageDimensions = { length: "11.5", width: "6.125", height: "0.25" }
        break
      case "flat":
        packageDimensions = { length: "15", width: "12", height: "0.75" }
        break
      case "parcel":
      default:
        // Keep default dimensions for parcel
        break
    }

    // Create shipment object for Shippo with required address fields
    const shipmentData = {
      address_from: {
        name: "Viking Freight",
        company: "Viking Freight",
        street1: "123 Main St",
        city: "Los Angeles",
        state: "CA",
        zip: fromZip.trim(),
        country: "US",
        phone: "555-123-4567",
        email: "shipping@vikingfreight.com",
      },
      address_to: {
        name: "Customer",
        company: "", // Added empty company field
        street1: "456 Oak Ave",
        city: "New York",
        state: "NY",
        zip: toZip.trim(),
        country: "US",
        phone: "555-987-6543", // Added phone field
        email: "customer@example.com", // Added email field
      },
      parcels: [
        {
          length: packageDimensions.length,
          width: packageDimensions.width,
          height: packageDimensions.height,
          distance_unit: "in",
          weight: weight,
          mass_unit: "lb",
        },
      ],
      async: false,
      extra: {
        is_return: false,
        signature_confirmation: false,
      },
    }

    console.log("Sending request to Shippo:", JSON.stringify(shipmentData, null, 2))

    // Make request to Shippo API
    const shippoResponse = await fetch("https://api.goshippo.com/shipments/", {
      method: "POST",
      headers: {
        Authorization: `ShippoToken ${shippoApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipmentData),
    })

    if (!shippoResponse.ok) {
      const errorText = await shippoResponse.text()
      console.error("Shippo API error:", shippoResponse.status, errorText)
      return NextResponse.json({ error: `Shippo API error: ${shippoResponse.status}` }, { status: 500 })
    }

    const shippoData = await shippoResponse.json()
    console.log("Shippo response:", JSON.stringify(shippoData, null, 2))

    // Extract rates from Shippo response, filtering out problematic carriers
    const rates: ShippingRate[] = []
    const allowedCarriers = ["USPS", "UPS", "FEDEX", "DHL", "DHLE", "DHLP"] // Added more carriers

    if (shippoData.rates && Array.isArray(shippoData.rates)) {
      shippoData.rates.forEach((rate: ShippoRate) => {
        // Skip rates with critical errors
        if (rate.messages && rate.messages.length > 0) {
          const hasCriticalError = rate.messages.some(
            (msg) => msg.text.includes("must not be empty") || msg.text.includes("Invalid token"),
          )
          if (hasCriticalError) {
            return
          }
          // Log warnings but don't filter them out
          rate.messages.forEach((msg) => {
            console.warn(`Rate warning for ${rate.provider} ${rate.servicelevel.name}: ${msg.text}`)
          })
        }

        // Only include US domestic carriers
        const carrier = rate.provider.toUpperCase()
        if (!allowedCarriers.includes(carrier)) {
          console.log(`Skipping carrier not in allowed list: ${carrier}`)
          return
        }

        // Validate rate amount
        const rateAmount = Number.parseFloat(rate.amount)
        if (isNaN(rateAmount) || rateAmount <= 0) {
          console.log(`Skipping rate with invalid amount: ${rate.amount}`)
          return
        }

        rates.push({
          id: rate.object_id,
          carrier: carrier,
          service: rate.servicelevel.name,
          rate: rateAmount,
          estimated_days: rate.estimated_days,
          duration_terms: rate.duration_terms,
        })
      })
    }

    // Sort rates by price
    rates.sort((a, b) => a.rate - b.rate)

    console.log(`Returning ${rates.length} valid rates`)

    // Return success even if no rates (better UX)
    if (rates.length === 0) {
      // Try to provide more helpful error message
      let message = "No shipping rates available for this route."

      if (shippoData.messages && Array.isArray(shippoData.messages) && shippoData.messages.length > 0) {
        message = shippoData.messages.map((m) => m.text).join(". ")
      } else if (shippoData.rates && shippoData.rates.length === 0) {
        message = "No rates returned from carriers. Try different ZIP codes or package dimensions."
      }

      return NextResponse.json({
        rates: [],
        source: "shippo",
        success: true,
        message,
      })
    }

    return NextResponse.json({
      rates,
      source: "shippo",
      success: true,
    })
  } catch (error) {
    console.error("Shipping rates API error:", error)
    return NextResponse.json({ error: "Internal server error calculating shipping rates" }, { status: 500 })
  }
}
