"use server"

import { z } from "zod"
import { shippingConfig } from "@/lib/config"
import type { EasyPost, Shippo } from "@/lib/types" // Assuming these types are defined

const addressSchema = z.object({
  name: z.string().optional(),
  street1: z.string(),
  street2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
})

const parcelSchema = z.object({
  length: z.number(),
  width: z.number(),
  height: z.number(),
  distance_unit: z.enum(["in", "cm"]),
  weight: z.number(),
  mass_unit: z.enum(["lb", "oz", "g", "kg"]),
})

const shipmentSchema = z.object({
  address_from: addressSchema,
  address_to: addressSchema,
  parcel: parcelSchema,
})

export async function getShippingRates(formData: FormData) {
  const data = Object.fromEntries(formData.entries())

  const parsed = shipmentSchema.safeParse({
    address_from: {
      name: data.fromName,
      street1: data.fromStreet1,
      street2: data.fromStreet2,
      city: data.fromCity,
      state: data.fromState,
      zip: data.fromZip,
      country: data.fromCountry,
      phone: data.fromPhone,
      email: data.fromEmail,
    },
    address_to: {
      name: data.toName,
      street1: data.toStreet1,
      street2: data.toStreet2,
      city: data.toCity,
      state: data.toState,
      zip: data.toZip,
      country: data.toCountry,
      phone: data.toPhone,
      email: data.toEmail,
    },
    parcel: {
      length: Number.parseFloat(data.length as string),
      width: Number.parseFloat(data.width as string),
      height: Number.parseFloat(data.height as string),
      distance_unit: data.distanceUnit,
      weight: Number.parseFloat(data.weight as string),
      mass_unit: data.massUnit,
    },
  })

  if (!parsed.success) {
    console.error("Validation error:", parsed.error.flatten().fieldErrors)
    return { success: false, error: "Invalid input data.", details: parsed.error.flatten().fieldErrors }
  }

  const shipmentData = parsed.data

  let rates: any[] = []
  let error: string | null = null

  if (shippingConfig.enableShippoIntegration && shippingConfig.shippoApiKey) {
    try {
      const shippoResponse = await fetch("https://api.goshippo.com/shipments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `ShippoToken ${shippingConfig.shippoApiKey}`,
        },
        body: JSON.stringify({
          address_from: shipmentData.address_from,
          address_to: shipmentData.address_to,
          parcels: [shipmentData.parcel],
          async: false, // Request synchronous rates
        }),
      })

      if (!shippoResponse.ok) {
        const errorData = await shippoResponse.json()
        throw new Error(`Shippo API error: ${shippoResponse.status} - ${JSON.stringify(errorData)}`)
      }

      const shippoData: Shippo.Shipment = await shippoResponse.json()
      rates = rates.concat(
        shippoData.rates.map((rate) => ({
          provider: rate.provider,
          servicelevel: rate.servicelevel.token,
          servicelevel_name: rate.servicelevel.name,
          amount: Number.parseFloat(rate.amount),
          currency: rate.currency,
          estimated_days: rate.estimated_days,
          duration_terms: rate.duration_terms,
        })),
      )
    } catch (e: any) {
      console.error("Shippo integration error:", e.message)
      error = error ? error + "; Shippo: " + e.message : "Shippo: " + e.message
    }
  }

  if (shippingConfig.enableEasypostIntegration && shippingConfig.easypostApiKey) {
    try {
      const easypostResponse = await fetch("https://api.easypost.com/v2/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${shippingConfig.easypostApiKey}`,
        },
        body: JSON.stringify({
          shipment: {
            to_address: shipmentData.address_to,
            from_address: shipmentData.address_from,
            parcel: shipmentData.parcel,
          },
        }),
      })

      if (!easypostResponse.ok) {
        const errorData = await easypostResponse.json()
        throw new Error(`EasyPost API error: ${easypostResponse.status} - ${JSON.stringify(errorData)}`)
      }

      const easypostData: EasyPost.Shipment = await easypostResponse.json()
      rates = rates.concat(
        easypostData.rates.map((rate) => ({
          provider: rate.carrier,
          servicelevel: rate.service,
          servicelevel_name: rate.service, // EasyPost uses service for both
          amount: Number.parseFloat(rate.rate),
          currency: rate.currency,
          estimated_days: rate.est_delivery_days,
          duration_terms: "business days", // Default for EasyPost
        })),
      )
    } catch (e: any) {
      console.error("EasyPost integration error:", e.message)
      error = error ? error + "; EasyPost: " + e.message : "EasyPost: " + e.message
    }
  }

  if (rates.length === 0 && error) {
    return { success: false, error: "No rates found. " + error }
  } else if (rates.length === 0) {
    return {
      success: false,
      error: "No shipping rates could be retrieved. Please check your addresses and parcel details.",
    }
  }

  return { success: true, rates, error }
}
