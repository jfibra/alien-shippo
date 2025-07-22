"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { signUp } from "@/lib/auth"
import { supabaseConfig } from "@/lib/config"

export function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
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
      const result = await signUp(email, password, firstName, null, lastName)

      if (!result.success && result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      } else {
        alert("Registration successful! Please check your email to confirm your account.")
        router.push("/login")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full"
            placeholder="John"
            disabled={!!environmentError || isLoading}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full"
            placeholder="Doe"
            disabled={!!environmentError || isLoading}
          />
        </div>
      </div>

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
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing up...
          </>
        ) : (
          "Sign up"
        )}
      </Button>
    </form>
  )
}
