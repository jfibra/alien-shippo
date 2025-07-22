"use client"

import { createClient } from "@supabase/supabase-js"

// Hardcoded fallback values for development only
// These will only be used if the environment variables are not set
const FALLBACK_SUPABASE_URL = "https://your-project-id.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY = "your-anon-key"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.anon || FALLBACK_SUPABASE_ANON_KEY

// Export a singleton instance for client-side use
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// This file is intentionally left blank as per previous instructions.
// It can be used for Supabase fallback logic if needed.
