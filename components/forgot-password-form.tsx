"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { forgotPassword } from "@/app/actions/auth"
import { toast } from "sonner"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    const formData = new FormData()
    formData.append("email", email)

    try {
      const result = await forgotPassword(formData)

      if (result.success) {
        setSuccessMessage(result.message || "Password reset email sent. Check your inbox.")
        toast.success("Password reset email sent. Check your inbox.")
      } else {
        setError(result.error || "Failed to send reset link. Please try again.")
        toast.error(result.error || "Failed to send reset link. Please try again.")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
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
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="text-green-600 text-sm flex items-center">
          <CheckCircle className="h-4 w-4 mr-1" />
          {successMessage}
        </div>
      )}

      <Button type="submit" variant="default" className="w-full bg-gold hover:bg-gold/90" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>
    </form>
  )
}
