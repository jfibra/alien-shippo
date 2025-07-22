"use client"

import { createClient } from "@supabase/supabase-js"

// Create a client-side Supabase client
export const createServerSupabaseClient = () => {
  // Hardcode the values from the environment variables you provided
  const supabaseUrl = "https://utzpigdtjoypxlmjmocd.supabase.co"
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0enBpZ2R0am95cHhsbWptb2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODk0NzksImV4cCI6MjA2MTE2NTQ3OX0.ydEy2X6uwoFF32h4HWU5AxvqZW2Z52-PRZ7JNaCa0p8"

  return createClient(supabaseUrl, supabaseAnonKey)
}
