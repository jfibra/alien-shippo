import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAllAddresses } from "@/lib/address-service"
import AddressBookPageClient from "./AddressBookPageClient"

function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
    },
  })
}

export const dynamic = "force-dynamic"

export default async function AddressesPage() {
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
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Address Book</h1>
          <p className="text-muted-foreground">Manage your shipping and return addresses for faster checkout.</p>
        </div>
      </div>
      <AddressBookPageClient initialAddresses={addresses || []} />
    </div>
  )
}
