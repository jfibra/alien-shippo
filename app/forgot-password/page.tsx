import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { AuthLayout } from "@/components/auth-layout"

export const metadata: Metadata = {
  title: "Forgot Password - Viking Freight",
  description: "Reset your password for your Viking Freight account.",
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a password reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
          <div className="mt-4 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-gold hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
