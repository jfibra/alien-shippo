"use server"

import { createClient } from "@/lib/supabase-server"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  if (!name || !email || !subject || !message) {
    return {
      success: false,
      error: "All fields are required",
    }
  }

  try {
    const supabase = createClient()

    const { error } = await supabase.from("contact_messages").insert([
      {
        name,
        email,
        subject,
        message,
        status: "new",
      },
    ])

    if (error) {
      console.error("Error inserting contact message:", error)
      return {
        success: false,
        error: "Failed to send message. Please try again.",
      }
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}
