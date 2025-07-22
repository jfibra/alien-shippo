import { getSession, getUserProfile } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { UserProfileClient } from "./user-profile-client"

export async function UserProfileServer() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const userProfile = await getUserProfile()

  if (!userProfile) {
    // This case should ideally not happen if user is logged in and profile is created on signup
    // but as a fallback, redirect or show an error
    redirect("/auth-error?message=User profile not found.")
  }

  return <UserProfileClient initialProfile={userProfile} />
}
