import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { UserSettingsForm } from "@/components/user-settings-form"
import { getUserPreferences, getUserSessions, getApiKeys } from "@/lib/settings-service"
import { getUserProfile } from "@/lib/user-service"

function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
    },
  })
}

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [preferencesResult, sessionsResult, apiKeysResult, profileResult] = await Promise.all([
    getUserPreferences(user.id),
    getUserSessions(user.id),
    getApiKeys(user.id),
    getUserProfile(user.id),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings, preferences, and API keys.</p>
      </div>
      <UserSettingsForm
        initialPreferences={preferencesResult.preferences || undefined}
        userSessions={sessionsResult.sessions || []}
        apiKeys={apiKeysResult.keys || []}
        initialProfile={profileResult.data!}
      />
    </div>
  )
}
