import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAllActivityLogs } from "@/lib/activity-service"
import ActivityPageClient from "./activity-page-client"

function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
    },
  })
}

export const dynamic = "force-dynamic"

export default async function ActivityPage() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { logs, totalCount } = await getAllActivityLogs(user.id)

  return <ActivityPageClient initialActivityLogs={logs} totalCount={totalCount} />
}
