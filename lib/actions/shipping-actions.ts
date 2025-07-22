"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"
import { revalidatePath } from "next/cache"

function getSupabaseServerActionClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
    },
  })
}

const shipmentRateSchema = z.object({
  from_address_id: z.string().uuid(),
  to_address_id: z.string().uuid(),
  weight_oz: z.coerce.number().positive(),
  length: z.coerce.number().positive(),
  width: z.coerce.number().positive(),
  height: z.coerce.number().positive(),
})

export async function getShippingRates(formData: FormData) {
  const supabase = getSupabaseServerActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const parsed = shipmentRateSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: "Invalid input", details: parsed.error.flatten().fieldErrors }
  }

  const { from_address_id, to_address_id, ...parcel } = parsed.data

  const { data: fromAddress } = await supabase.from("addresses").select("*").eq("id", from_address_id).single()
  const { data: toAddress } = await supabase.from("addresses").select("*").eq("id", to_address_id).single()

  if (!fromAddress || !toAddress) {
    return { success: false, error: "Invalid addresses selected." }
  }

  const shippoResponse = await fetch("https://api.goshippo.com/shipments/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
    },
    body: JSON.stringify({
      address_from: {
        name: fromAddress.recipient_name,
        street1: fromAddress.address_line1,
        city: fromAddress.city,
        state: fromAddress.state,
        zip: fromAddress.postal_code,
        country: fromAddress.country,
      },
      address_to: {
        name: toAddress.recipient_name,
        street1: toAddress.address_line1,
        city: toAddress.city,
        state: toAddress.state,
        zip: toAddress.postal_code,
        country: toAddress.country,
      },
      parcels: [
        {
          length: parcel.length.toString(),
          width: parcel.width.toString(),
          height: parcel.height.toString(),
          distance_unit: "in",
          weight: parcel.weight_oz.toString(),
          mass_unit: "oz",
        },
      ],
      async: false,
    }),
  })

  if (!shippoResponse.ok) {
    const errorData = await shippoResponse.json()
    return { success: false, error: `Shippo API error: ${JSON.stringify(errorData)}` }
  }

  const shippoData = await shippoResponse.json()
  return { success: true, rates: shippoData.rates }
}

const createShipmentSchema = shipmentRateSchema.extend({
  rate_id: z.string(),
  carrier: z.string(),
  service: z.string(),
  cost: z.coerce.number(),
})

export async function createShipment(formData: FormData) {
  const supabase = getSupabaseServerActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const parsed = createShipmentSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: "Invalid input", details: parsed.error.flatten().fieldErrors }
  }

  const { from_address_id, to_address_id, rate_id, ...shipmentDetails } = parsed.data

  // 1. Deduct balance
  const { error: deductError } = await supabase.rpc("deduct_funds", {
    p_user_id: user.id,
    p_amount: shipmentDetails.cost,
  })
  if (deductError) {
    return { success: false, error: "Insufficient funds or billing error." }
  }

  // 2. Create shipment record
  const { data: shipment, error: shipmentError } = await supabase
    .from("shipments")
    .insert({
      user_id: user.id,
      from_address_id,
      to_address_id,
      rate_id,
      ...shipmentDetails,
      status: "created",
    })
    .select("id")
    .single()

  if (shipmentError) {
    // TODO: Refund logic if shipment creation fails after deduction
    return { success: false, error: "Failed to create shipment record." }
  }

  // 3. Create transaction record
  await supabase.from("transactions").insert({
    user_id: user.id,
    shipment_id: shipment.id,
    amount: -shipmentDetails.cost,
    status: "completed",
    provider: "internal",
    transaction_reference: `shipment_${shipment.id}`,
  })

  revalidatePath("/dashboard/shipments")
  revalidatePath("/dashboard/billing")
  return { success: true, shipmentId: shipment.id }
}
