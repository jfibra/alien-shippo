"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { signIn, sendMagicLink } from "@/lib/auth"
import { supabaseConfig } from "@/lib/config"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [environmentError, setEnvironmentError] = useState<string | null>(null)

  // Check for environment variables on component mount
  useEffect(() => {
    if (!supabaseConfig.url) {
      setEnvironmentError("Supabase URL is not configured. Please check your environment variables.")
    } else if (!supabaseConfig.anonKey) {
      setEnvironmentError("Supabase Anon Key is not configured. Please check your environment variables.")
    } else {
      setEnvironmentError(null)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (environmentError) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn(email, password)

      if (!result.success && result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLinkLogin = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (environmentError) {
      return
    }

    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsMagicLinkLoading(true)
    setError(null)

    try {
      const result = await sendMagicLink(email)

      if (!result.success && result.error) {
        setError(result.error)
        setIsMagicLinkLoading(false)
      } else {
        setError(null)
        alert(`We've sent a magic link to ${email}. Please check your inbox.`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      setIsMagicLinkLoading(false)
    } finally {
      setIsMagicLinkLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {environmentError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start mb-4">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <p className="font-medium">Configuration Error</p>
            <p>{environmentError}</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          placeholder="your.email@example.com"
          disabled={!!environmentError || isLoading}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Link href="/forgot-password" className="text-sm text-gold hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pr-10"
            placeholder="••••••••"
            disabled={!!environmentError || isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
            disabled={!!environmentError}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="rememberMe"
          name="rememberMe"
          type="checkbox"
          className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
          disabled={!!environmentError}
        />
        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
          Remember me
        </label>
      </div>

      {error && (
        <div className="text-red-500 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="default"
        className="w-full bg-gold hover:bg-gold/90"
        disabled={isLoading || !!environmentError}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
          </>
        ) : (
          "Log in"
        )}
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full bg-transparent"
        onClick={handleMagicLinkLogin}
        disabled={isMagicLinkLoading || !!environmentError}
      >
        {isMagicLinkLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending magic link...
          </>
        ) : (
          "Continue with Magic Link"
        )}
      </Button>
    </form>
  )
}
