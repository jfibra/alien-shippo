import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { UserProfileForm } from "@/components/user-profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, Phone, Building, Globe, User } from "lucide-react"

// Helper to get Supabase client for server components
function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
      remove: (name: string, options: any) => cookieStore.set(name, "", options),
    },
  })
}

export default async function ProfilePage() {
  const supabase = getSupabaseServerClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  // Fetch user profile from users table
  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .eq("is_deleted", false)
    .single()

  if (profileError) {
    console.error("Error fetching user profile:", profileError)
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Profile</h1>
          <p className="text-gray-600 mt-2">Unable to load your profile information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Your Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={userProfile.is_active ? "default" : "destructive"}>
            {userProfile.is_active ? "Active" : "Inactive"}
          </Badge>
          <Badge variant={userProfile.email_verified ? "default" : "secondary"}>
            {userProfile.email_verified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Overview
              </CardTitle>
              <CardDescription>Your account summary and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {userProfile.first_name?.[0]}
                  {userProfile.last_name?.[0]}
                </div>
                <h3 className="font-semibold text-lg">{userProfile.full_name}</h3>
                <p className="text-gray-600 capitalize">{userProfile.role}</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{userProfile.email}</span>
                </div>

                {userProfile.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{userProfile.phone}</span>
                  </div>
                )}

                {userProfile.company && (
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span>{userProfile.company}</span>
                  </div>
                )}

                {userProfile.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a
                      href={userProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {userProfile.website}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  <span>Joined {new Date(userProfile.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {userProfile.bio && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Bio</h4>
                  <p className="text-sm text-gray-600">{userProfile.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>Recent account activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Login:</span>
                <span className="font-medium">
                  {userProfile.last_login ? new Date(userProfile.last_login).toLocaleDateString() : "Never"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Active:</span>
                <span className="font-medium">
                  {userProfile.last_active ? new Date(userProfile.last_active).toLocaleDateString() : "Never"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Profile Updated:</span>
                <span className="font-medium">{new Date(userProfile.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <UserProfileForm initialData={userProfile} />
        </div>
      </div>
    </div>
  )
}
