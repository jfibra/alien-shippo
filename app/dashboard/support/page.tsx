import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SupportPage } from "./support-page-client"
import { getSupportTickets } from "@/lib/support-service"

function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
    },
  })
}

export const dynamic = "force-dynamic"

export default async function SupportPageServer() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { tickets, error } = await getSupportTickets(user.id)

  if (error) {
    return <div>Error loading support tickets: {error}</div>
  }

  return <SupportPage initialTickets={tickets || []} />
}
