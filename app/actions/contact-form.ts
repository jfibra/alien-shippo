"use server"

import { createClient } from "@/lib/supabase-server"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return {
      success: false,
      error: "All fields are required. Please fill out the complete form.",
    }
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    }
  }

  // Validate field lengths
  if (name.length > 100) {
    return {
      success: false,
      error: "Name must be less than 100 characters.",
    }
  }

  if (subject.length > 200) {
    return {
      success: false,
      error: "Subject must be less than 200 characters.",
    }
  }

  if (message.length > 2000) {
    return {
      success: false,
      error: "Message must be less than 2000 characters.",
    }
  }

  try {
    const supabase = createClient()

    const { error } = await supabase.from("contact_messages").insert([
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        status: "new",
      },
    ])

    if (error) {
      console.error("Error inserting contact message:", error)
      return {
        success: false,
        error: "Failed to send message. Please try again later.",
      }
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Unexpected error in contact form:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    }
  }
}
