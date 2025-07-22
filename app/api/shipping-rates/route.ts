import { type NextRequest, NextResponse } from "next/server"
import { shippingConfig } from "@/lib/config"

const SHIPPO_API_KEY = shippingConfig.shippoApiKey
const SHIPPO_API_URL = "https://api.goshippo.com/v1"

interface ShippoRate {
  object_id: string
  amount: string
  currency: string
  amount_local: string
  currency_local: string
  provider: string
  servicelevel: {
    name: string
    token: string
  }
  estimated_days: number
  duration_terms: string
}

interface ShippoShipment {
  rates: ShippoRate[]
}

export async function POST(request: NextRequest) {
  try {
    if (!SHIPPO_API_KEY) {
      return NextResponse.json({ error: "Shippo API key not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { fromZip, toZip, weight, packageType, length, width, height } = body

    // Validate required fields
    if (!fromZip || !toZip || !weight) {
      return NextResponse.json({ error: "Missing required fields: fromZip, toZip, weight" }, { status: 400 })
    }

    // Convert weight to pounds (Shippo expects weight in pounds)
    const weightInPounds = Number.parseFloat(weight)
    if (isNaN(weightInPounds) || weightInPounds <= 0) {
      return NextResponse.json({ error: "Invalid weight value" }, { status: 400 })
    }

    // Set default dimensions if not provided or if using standard package types
    let packageDimensions = {
      length: "12",
      width: "8",
      height: "6",
    }

    // Override with custom dimensions if provided
    if (packageType === "custom" && length && width && height) {
      packageDimensions = { length, width, height }
    } else {
      // Set predefined dimensions for standard package types
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
          packageDimensions = { length: "10", width: "7", height: "4.75" }
          break
        case "regional_b":
          packageDimensions = { length: "12", width: "10.25", height: "5" }
          break
        case "letter":
          packageDimensions = { length: "11.5", width: "6.125", height: "0.25" }
          break
        case "flat":
          packageDimensions = { length: "15", width: "12", height: "0.75" }
          break
        case "ups_small_box":
          packageDimensions = { length: "13", width: "11", height: "2" } // Example dimensions
          break
        case "ups_medium_box":
          packageDimensions = { length: "15", width: "12", height: "3" } // Example dimensions
          break
        case "ups_large_box":
          packageDimensions = { length: "18", width: "13", height: "3" } // Example dimensions
          break
        case "parcel": // Default parcel dimensions if not custom
        default:
          packageDimensions = { length: "12", width: "8", height: "6" }
          break
      }
    }

    // Create shipment object for Shippo
    const shipmentData = {
      address_from: {
        zip: fromZip,
        country: "US",
      },
      address_to: {
        zip: toZip,
        country: "US",
      },
      parcels: [
        {
          length: packageDimensions.length,
          width: packageDimensions.width,
          height: packageDimensions.height,
          distance_unit: "in",
          weight: weightInPounds.toString(),
          mass_unit: "lb",
        },
      ],
      async: false,
    }

    console.log("Sending request to Shippo:", JSON.stringify(shipmentData, null, 2))

    // Make request to Shippo API
    const response = await fetch(`${SHIPPO_API_URL}/shipments/`, {
      method: "POST",
      headers: {
        Authorization: `ShippoToken ${SHIPPO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipmentData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Shippo API error:", response.status, errorText)

      let errorMessage = "Failed to get shipping rates from Shippo"
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch (e) {
        // Use default error message if parsing fails
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const shipmentResponse: ShippoShipment = await response.json()
    console.log("Shippo response:", JSON.stringify(shipmentResponse, null, 2))

    // Check if we got rates
    if (!shipmentResponse.rates || shipmentResponse.rates.length === 0) {
      return NextResponse.json({ error: "No shipping rates available for this route" }, { status: 404 })
    }

    // Transform Shippo rates to our format
    const transformedRates = shipmentResponse.rates
      .filter((rate: ShippoRate) => {
        // Filter out rates with invalid amounts
        const amount = Number.parseFloat(rate.amount)
        return !isNaN(amount) && amount > 0
      })
      .map((rate: ShippoRate) => ({
        id: rate.object_id,
        service: rate.servicelevel.name,
        carrier: rate.provider.toUpperCase(),
        rate: Number.parseFloat(rate.amount),
        delivery_days: rate.estimated_days,
        estimated_days: rate.estimated_days,
        duration_terms: rate.duration_terms,
        currency: rate.currency,
      }))
      .sort((a, b) => a.rate - b.rate) // Sort by price, lowest first

    console.log(`Returning ${transformedRates.length} transformed rates`)

    return NextResponse.json({
      success: true,
      rates: transformedRates,
      source: "shippo",
    })
  } catch (error) {
    console.error("Error in shipping rates API:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        details: "Please check your request parameters and try again",
      },
      { status: 500 },
    )
  }
}
