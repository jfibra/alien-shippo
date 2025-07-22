"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { resendVerificationEmail, triggerVerificationEmail } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Swal } from "@/components/sweet-alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams?.get("email") || ""
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendCooldown])

  // Try both methods to send verification email
  const handleResendVerification = async () => {
    if (resendCooldown > 0 || !email) return

    setIsResending(true)
    try {
      console.log("Resending verification email to:", email)

      // Try the standard resend method first
      let result = await resendVerificationEmail(email)

      // If that fails, try the manual trigger method
      if (!result.success) {
        console.log("Standard resend failed, trying manual trigger")
        result = await triggerVerificationEmail(email)
      }

      if (result.success) {
        Swal.success("Email Sent", "Verification email has been sent. Please check your inbox and spam folder.")
        setResendCooldown(60) // Set a 60-second cooldown
      } else {
        Swal.error("Error", result.error || "Failed to send verification email")
      }
    } catch (error) {
      console.error("Error resending verification:", error)
      Swal.error("Error", "An unexpected error occurred")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <SiteHeader />
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl text-green-600">Verify Your Email</CardTitle>
          <CardDescription>
            A verification link has been sent to your email address. Please click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">If you don&apos;t see the email, please check your spam folder.</p>
          <Button
            onClick={handleResendVerification}
            disabled={isResending || resendCooldown > 0}
            className="w-full"
            variant="outline"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              "Resend verification email"
            )}
          </Button>
          <Button asChild className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
      <SiteFooter />
    </div>
  )
}
