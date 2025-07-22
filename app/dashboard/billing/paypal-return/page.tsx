"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Swal } from "@/components/sweet-alert"

export default function PayPalReturnPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Processing your PayPal payment...")

  useEffect(() => {
    const token = searchParams.get("token")
    const payerId = searchParams.get("PayerID")
    const paymentId = searchParams.get("paymentId") // For older PayPal integrations if applicable
    const orderId = searchParams.get("token") // PayPal often uses 'token' as the order ID for redirects

    if (!orderId) {
      setStatus("error")
      setMessage("Missing PayPal order information. Please try again.")
      Swal.error("Payment Error", "Missing PayPal order information. Please try again.")
      return
    }

    const processPayment = async () => {
      try {
        const response = await fetch("/api/process-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paypalOrderId: orderId,
            // You might pass amount here if it's not already known on the server
            // For simplicity, assuming amount is handled server-side based on orderId
          }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setStatus("success")
          setMessage("Your payment was successfully processed!")
          Swal.success("Payment Successful", "Your account balance has been updated.")
          // Redirect to billing overview or dashboard after a short delay
          setTimeout(() => router.push("/dashboard/billing"), 3000)
        } else {
          setStatus("error")
          setMessage(data.error || "Failed to process your PayPal payment. Please try again.")
          Swal.error("Payment Failed", data.error || "Failed to process your PayPal payment. Please try again.")
        }
      } catch (error) {
        console.error("Error processing PayPal return:", error)
        setStatus("error")
        setMessage("An unexpected error occurred while processing your payment.")
        Swal.error("Payment Failed", "An unexpected error occurred. Please try again.")
      }
    }

    processPayment()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            {status === "loading" && <Loader2 className="h-6 w-6 animate-spin text-blue-500" />}
            {status === "success" && <CheckCircle className="h-6 w-6 text-green-500" />}
            {status === "error" && <XCircle className="h-6 w-6 text-red-500" />}
            {status === "loading"
              ? "Processing Payment"
              : status === "success"
                ? "Payment Successful"
                : "Payment Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" && <p className="text-sm text-gray-500">Please do not close this page.</p>}
          {status !== "loading" && (
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild>
                <Link href="/dashboard/billing">Go to Billing</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
