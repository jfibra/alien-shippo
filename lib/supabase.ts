// This file is a barrel file to re-export from the appropriate client or server file
// depending on the context where it's imported

// Re-export the client-side Supabase client
export { supabase } from "./supabase-browser"

// Export the UserProfile type
export type { UserProfile } from "./supabase-server"

// Note: Server-side functions should be imported directly from supabase-server
// and only used in Server Components or Server Actions

// This file is intentionally left blank as per previous instructions.
// It can be used for Supabase client initialization if needed.
