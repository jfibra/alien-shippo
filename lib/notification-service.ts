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

export type Notification = {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

export async function getNotifications(userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching notifications:", error)
    return { notifications: [], error: error.message }
  }

  return { notifications: data || [], error: null }
}

export async function markNotificationAsRead(notificationId: string, userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId)

  if (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteNotification(notificationId: string, userId: string) {
  const supabase = getSupabaseServerActionClient()
  const { error } = await supabase.from("notifications").delete().eq("id", notificationId).eq("user_id", userId)

  if (error) {
    console.error("Error deleting notification:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
