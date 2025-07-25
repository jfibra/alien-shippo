"use client"

import { createBrowserClient } from "@supabase/ssr"
import { supabaseConfig } from "./config"

export function createClient() {
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey)
}

export const supabase = createClient()
