"use client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { getAllAddresses } from "@/lib/address-service"
import { CreateShipmentClient } from "@/components/create-shipment-client"

type ShippingRate = {
  id: string
  service: string
  carrier: string
  rate: number
  delivery_days: number | null
  estimated_days: number | null
  duration_terms: string | null
}

type Address = {
  id: string
  name: string
  company_name: string | null
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  is_residential: boolean
  address_type: string
  email: string | null
}

function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createClientComponentClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    },
  )
}

export const dynamic = "force-dynamic"

export default async function ShipPage() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { addresses, error } = await getAllAddresses(user.id)

  if (error) {
    return <div>Error loading addresses: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">Create a Shipment</h1>
        <p className="text-muted-foreground">Follow the steps to get rates and create your shipping label.</p>
      </div>
      <CreateShipmentClient initialAddresses={addresses || []} userId={user.id} />
    </div>
  )
}
