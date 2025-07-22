"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { Swal } from "@/components/sweet-alert"
import { useRouter } from "next/navigation"

interface AddPaymentMethodFormProps {
  userId: string
}

export function AddPaymentMethodForm({ userId }: AddPaymentMethodFormProps) {
  const router = useRouter()
  const [cardNumber, setCardNumber] = useState("")
  const [expMonth, setExpMonth] = useState("")
  const [expYear, setExpYear] = useState("")
  const [cvc, setCvc] = useState("")
  const [billingZip, setBillingZip] = useState("")
  const [isDefault, setIsDefault] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Basic client-side validation
    if (!cardNumber || !expMonth || !expYear || !cvc || !billingZip) {
      setError("All fields are required.")
      setIsLoading(false)
      return
    }
    if (cardNumber.replace(/\s/g, "").length < 13 || cardNumber.replace(/\s/g, "").length > 19) {
      setError("Invalid card number length.")
      setIsLoading(false)
      return
    }
    if (!/^\d{2}$/.test(expMonth) || Number.parseInt(expMonth) < 1 || Number.parseInt(expMonth) > 12) {
      setError("Invalid expiration month (MM).")
      setIsLoading(false)
      return
    }
    if (!/^\d{4}$/.test(expYear) || Number.parseInt(expYear) < new Date().getFullYear()) {
      setError("Invalid expiration year (YYYY).")
      setIsLoading(false)
      return
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      setError("Invalid CVC.")
      setIsLoading(false)
      return
    }

    try {
      // In a real application, you would send card details to a payment gateway (e.g., Stripe)
      // to get a secure token, and then send that token to your backend API.
      // For this mock, we'll directly call our API route with the raw (but not real) data.
      const response = await fetch("/api/payment-methods/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          card_number: cardNumber.replace(/\s/g, ""), // Remove spaces for backend
          exp_month: expMonth,
          exp_year: expYear,
          cvc: cvc,
          billing_zip: billingZip,
          is_default: isDefault,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        Swal.success("Success", "Payment method added successfully!")
        router.push("/dashboard/billing") // Redirect to billing overview
        router.refresh() // Refresh data on the billing page
      } else {
        setError(data.error || "Failed to add payment method. Please try again.")
        Swal.error("Error", data.error || "Failed to add payment method.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
      Swal.error("Error", err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          <p>{error}</p>
        </div>
      )}
      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          type="text"
          placeholder="**** **** **** ****"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          disabled={isLoading}
          maxLength={19} // Max length for card numbers
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="expMonth">Expiration Month (MM)</Label>
          <Input
            id="expMonth"
            type="text"
            placeholder="MM"
            value={expMonth}
            onChange={(e) => setExpMonth(e.target.value)}
            disabled={isLoading}
            maxLength={2}
          />
        </div>
        <div>
          <Label htmlFor="expYear">Expiration Year (YYYY)</Label>
          <Input
            id="expYear"
            type="text"
            placeholder="YYYY"
            value={expYear}
            onChange={(e) => setExpYear(e.target.value)}
            disabled={isLoading}
            maxLength={4}
          />
        </div>
        <div>
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            type="text"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            disabled={isLoading}
            maxLength={4}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="billingZip">Billing Zip Code</Label>
        <Input
          id="billingZip"
          type="text"
          placeholder="e.g., 90210"
          value={billingZip}
          onChange={(e) => setBillingZip(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={isDefault}
          onCheckedChange={(checked) => setIsDefault(!!checked)}
          disabled={isLoading}
        />
        <Label htmlFor="isDefault">Set as default payment method</Label>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
          </>
        ) : (
          "Add Payment Method"
        )}
      </Button>
    </form>
  )
}
