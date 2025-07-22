"use client"

import { useEffect, useState } from "react"

export function useEnvironmentCheck() {
  const [status, setStatus] = useState<{
    supabaseUrl: boolean
    supabaseAnonKey: boolean
    allValid: boolean
  }>({
    supabaseUrl: false,
    supabaseAnonKey: false,
    allValid: false,
  })

  useEffect(() => {
    const supabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setStatus({
      supabaseUrl,
      supabaseAnonKey,
      allValid: supabaseUrl && supabaseAnonKey,
    })
  }, [])

  return status
}

export function EnvDebugComponent() {
  const status = useEnvironmentCheck()

  if (process.env.NODE_ENV === "production") {
    return null // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50">
      <h3 className="font-bold mb-2">Environment Variables:</h3>
      <ul>
        <li className={status.supabaseUrl ? "text-green-400" : "text-red-400"}>
          NEXT_PUBLIC_SUPABASE_URL: {status.supabaseUrl ? "✓" : "✗"}
        </li>
        <li className={status.supabaseAnonKey ? "text-green-400" : "text-red-400"}>
          NEXT_PUBLIC_SUPABASE_ANON_KEY: {status.supabaseAnonKey ? "✓" : "✗"}
        </li>
      </ul>
      <div className="mt-2 pt-2 border-t border-white/20">
        Status:{" "}
        {status.allValid ? (
          <span className="text-green-400">All variables loaded</span>
        ) : (
          <span className="text-red-400">Missing variables</span>
        )}
      </div>
    </div>
  )
}
