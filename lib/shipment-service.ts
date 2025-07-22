"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

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

export type Shipment = {
  id: string
  user_id: string
  from_address_id: string
  to_address_id: string
  carrier: string
  service: string
  tracking_number: string | null
  label_url: string | null
  status: string
  cost: number | null
  weight_oz: number | null
  dimensions: Record<string, any> | null
  shipment_date: string | null
  delivery_date: string | null
  created_at: string
  updated_at: string
}

export async function getShipments(userId: string, page = 1, pageSize = 10) {
  const supabase = getSupabaseServerActionClient()
  const offset = (page - 1) * pageSize

  const { data, error, count } = await supabase
    .from("shipments")
    .select(
      `
      *,
      from_address:addresses!shipments_from_address_id_fkey(*),
      to_address:addresses!shipments_to_address_id_fkey(*)
    `,
      { count: "exact" },
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (error) {
    console.error("Error fetching shipments:", error)
    return { shipments: [], totalCount: 0 }
  }

  return { shipments: data || [], totalCount: count || 0 }
}

export async function getShipmentById(shipmentId: string, userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("shipments")
    .select(`
      *,
      from_address:addresses!shipments_from_address_id_fkey(*),
      to_address:addresses!shipments_to_address_id_fkey(*)
    `)
    .eq("id", shipmentId)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching shipment:", error)
    return { shipment: null, error: error.message }
  }

  return { shipment: data, error: null }
}
