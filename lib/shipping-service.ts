"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Shipment } from "./types"

function getSupabaseServerActionClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
      remove: (name: string, options: any) => cookieStore.set(name, "", options),
    },
  })
}

export async function getRecentShipments(userId: string, limit = 5): Promise<Shipment[]> {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("shipments")
    .select("*, from_address(*), to_address(*)") // Select related address data
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent shipments:", error)
    return []
  }

  return data || []
}

export async function getAllShipments(
  userId: string,
  page = 1,
  pageSize = 10,
  filters: { search?: string; status?: string; carrier?: string } = {},
): Promise<{ shipments: Shipment[]; totalCount: number }> {
  const supabase = getSupabaseServerActionClient()
  const offset = (page - 1) * pageSize

  let query = supabase
    .from("shipments")
    .select("*, from_address(*), to_address(*)", { count: "exact" })
    .eq("user_id", userId)

  if (filters.status) {
    query = query.eq("status", filters.status)
  }
  if (filters.carrier) {
    query = query.eq("carrier", filters.carrier)
  }
  if (filters.search) {
    // Basic search on tracking number or description
    query = query.or(`tracking_number.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (error) {
    console.error("Error fetching all shipments:", error)
    return { shipments: [], totalCount: 0 }
  }

  return { shipments: data || [], totalCount: count || 0 }
}

export async function getShipmentDetails(shipmentId: string, userId: string): Promise<Shipment | null> {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("shipments")
    .select("*, from_address(*), to_address(*)")
    .eq("id", shipmentId)
    .eq("user_id", userId) // Ensure user owns the shipment
    .single()

  if (error) {
    console.error("Error fetching shipment details:", error)
    return null
  }

  return data || null
}

export async function createShipment(
  shipmentData: Omit<Shipment, "id" | "created_at" | "updated_at" | "tracking_history">,
): Promise<{ success: boolean; shipmentId?: string; error?: string }> {
  const supabase = getSupabaseServerActionClient()

  // First, insert or update addresses to ensure they exist and get their IDs
  let fromAddressId: string | undefined
  let toAddressId: string | undefined

  // Mock address creation/lookup for simplicity. In a real app, you'd use address_service.ts
  // and potentially validate/normalize addresses before saving.
  const { data: fromAddr, error: fromAddrError } = await supabase
    .from("addresses")
    .insert({
      user_id: shipmentData.user_id,
      name: shipmentData.from_address.name,
      street1: shipmentData.from_address.street1,
      street2: shipmentData.from_address.street2,
      city: shipmentData.from_address.city,
      state: shipmentData.from_address.state,
      zip: shipmentData.from_address.zip,
      country: shipmentData.from_address.country,
      phone: shipmentData.from_address.phone,
      email: shipmentData.from_address.email,
      is_residential: shipmentData.from_address.is_residential,
    })
    .select("id")
    .single()

  if (fromAddrError) {
    console.error("Error saving from_address:", fromAddrError)
    return { success: false, error: "Failed to save origin address." }
  }
  fromAddressId = fromAddr.id

  const { data: toAddr, error: toAddrError } = await supabase
    .from("addresses")
    .insert({
      user_id: shipmentData.user_id,
      name: shipmentData.to_address.name,
      street1: shipmentData.to_address.street1,
      street2: shipmentData.to_address.street2,
      city: shipmentData.to_address.city,
      state: shipmentData.to_address.state,
      zip: shipmentData.to_address.zip,
      country: shipmentData.to_address.country,
      phone: shipmentData.to_address.phone,
      email: shipmentData.to_address.email,
      is_residential: shipmentData.to_address.is_residential,
    })
    .select("id")
    .single()

  if (toAddrError) {
    console.error("Error saving to_address:", toAddrError)
    return { success: false, error: "Failed to save destination address." }
  }
  toAddressId = toAddr.id

  // Now insert the shipment with the address IDs
  const { data, error } = await supabase
    .from("shipments")
    .insert({
      user_id: shipmentData.user_id,
      from_address_id: fromAddressId,
      to_address_id: toAddressId,
      parcel_length: shipmentData.parcel_length,
      parcel_width: shipmentData.parcel_width,
      parcel_height: shipmentData.parcel_height,
      parcel_distance_unit: shipmentData.parcel_distance_unit,
      parcel_weight: shipmentData.parcel_weight,
      parcel_mass_unit: shipmentData.parcel_mass_unit,
      carrier: shipmentData.carrier,
      service_level: shipmentData.service_level,
      cost: shipmentData.cost,
      currency: shipmentData.currency,
      tracking_number: shipmentData.tracking_number,
      status: shipmentData.status,
      label_url: shipmentData.label_url,
      invoice_url: shipmentData.invoice_url,
      description: shipmentData.description,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating shipment:", error)
    return { success: false, error: error.message }
  }

  return { success: true, shipmentId: data.id }
}
