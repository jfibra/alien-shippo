"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPassword } from "@/app/actions/auth"

/**
 * ForgotPasswordForm
 *
 * Sends a password-reset email using the `forgotPassword` server action.
 * On success the user is shown a confirmation panel, otherwise errors are
 * surfaced inline as well as via toast notifications.
 */
const ForgotPasswordForm: React.FC = () => {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await forgotPassword(formData)

      if (result.success) {
        setSuccess(true)
        toast.success("Password reset email sent", {
          description: "Check your inbox for instructions to reset your password.",
        })
      } else {
        setError(result.error || "Failed to send password reset email.")
        toast.error("Password reset failed", {
          description: result.error || "An error occurred. Please try again.",
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred."
      setError(message)
      toast.error("Password reset failed", { description: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground">Enter your email to receive a password&nbsp;reset link</p>
      </div>

      {success ? (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
          <p>Password reset email sent! Check your inbox for instructions to reset your password.</p>
          <div className="mt-4">
            <Button onClick={() => router.push("/login")} className="w-full" variant="outline">
              Back to Login
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="flex items-center text-sm text-destructive">
              <AlertCircle className="mr-1 h-4 w-4" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <div className="text-center text-sm">
            <Button variant="link" className="h-auto p-0" onClick={() => router.push("/login")}>
              Back to Login
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ForgotPasswordForm
export { ForgotPasswordForm }
