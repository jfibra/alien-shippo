"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"
import { revalidatePath } from "next/cache"

function getSupabaseServerActionClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
    },
  })
}

const ticketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function createSupportTicket(formData: FormData) {
  const supabase = getSupabaseServerActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const parsed = ticketSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from("support_tickets").insert({
    ...parsed.data,
    user_id: user.id,
    status: "open",
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/support")
  return { success: true, message: "Support ticket created successfully." }
}
