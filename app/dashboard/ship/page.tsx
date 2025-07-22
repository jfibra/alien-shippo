import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { getAllAddresses } from "@/lib/address-service"
import { CreateShipmentClient } from "@/components/create-shipment-client"

function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
    },
  })
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
        <p className="text-muted-foreground">
          Select addresses, enter parcel details, fetch live rates, and purchase your label.
        </p>
      </div>
      <CreateShipmentClient initialAddresses={addresses || []} userId={user.id} />
    </div>
  )
}
