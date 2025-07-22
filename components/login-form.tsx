"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { signInWithEmail, magicLinkLogin } from "@/app/actions/auth"
import { toast } from "sonner"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    try {
      const result = await signInWithEmail(email, password)

      if (!result.success) {
        setError(result.error || "Login failed")
        toast.error(result.error || "Login failed")
      } else {
        toast.success("Login successful!")
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLinkLogin = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email address")
      toast.error("Please enter your email address")
      return
    }

    setIsMagicLinkLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("email", email)

    try {
      const result = await magicLinkLogin(formData)

      if (!result.success) {
        setError(result.error || "Failed to send magic link")
        toast.error(result.error || "Failed to send magic link")
      } else {
        toast.success(`Magic link sent to ${email}! Check your inbox.`)
        setError(null)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsMagicLinkLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email Address</Label>
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
          disabled={isLoading || isMagicLinkLoading}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="password">Password</Label>
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
            disabled={isLoading || isMagicLinkLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
            disabled={isLoading || isMagicLinkLoading}
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
        disabled={isLoading || isMagicLinkLoading}
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
        disabled={isMagicLinkLoading || isLoading}
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
