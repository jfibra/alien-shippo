"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"
import { Swal } from "@/components/sweet-alert"
import { paymentConfig } from "@/lib/config"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useRouter } from "next/navigation"

interface AddFundsFormProps {
  userId: string
}

export function AddFundsForm({ userId }: AddFundsFormProps) {
  const router = useRouter()
  const [amount, setAmount] = useState<string>("25.00")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">("paypal")
  const [isLoading, setIsLoading] = useState(false)

  const handleAmountChange = (value: string) => {
    setAmount(value)
    setCustomAmount("") // Clear custom amount if a preset is selected
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value)
      setAmount(value) // Update main amount state
    }
  }

  const finalAmount = Number.parseFloat(amount) || 0

  // PayPal Integration
  const createOrder = async (data: any, actions: any) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/create-paypal-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: finalAmount }),
      })

      const order = await response.json()

      if (response.ok && order.orderId) {
        return order.orderId
      } else {
        throw new Error(order.error || "Failed to create PayPal order.")
      }
    } catch (error: any) {
      console.error("Error creating PayPal order:", error)
      Swal.error("PayPal Error", error.message || "Could not create PayPal order. Please try again.")
      setIsLoading(false)
      return "" // Return empty string to prevent PayPal from proceeding
    }
  }

  const onApprove = async (data: any, actions: any) => {
    setIsLoading(true)
    try {
      // This is where you'd typically capture the payment on your server
      // For this example, we'll rely on the /api/process-payment route
      // which will be called by the paypal-return page after redirect.
      // PayPal's JS SDK handles the redirect automatically after approval.
      // We don't need to call /api/process-payment here directly.
      // The return URL configured in your PayPal app and passed during order creation
      // will handle the final server-side processing.
      Swal.success("Payment Initiated", "Redirecting to PayPal for completion...")
    } catch (error: any) {
      console.error("Error during PayPal approval:", error)
      Swal.error("PayPal Error", error.message || "An error occurred during PayPal approval.")
    } finally {
      setIsLoading(false)
    }
  }

  const onError = (err: any) => {
    console.error("PayPal Checkout Error:", err)
    Swal.error("PayPal Error", "PayPal checkout encountered an error. Please try again.")
    setIsLoading(false)
  }

  const onCancel = (data: any) => {
    console.log("PayPal checkout cancelled:", data)
    Swal.info("Payment Cancelled", "You have cancelled the PayPal payment.")
    setIsLoading(false)
  }

  // Card Payment (Mocked)
  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // In a real application, you would use a Stripe/other payment gateway SDK
      // to tokenize card details and then send the token to your /api/process-payment endpoint.
      // For this mock, we'll simulate a successful card payment.
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: finalAmount,
          paymentMethodId: "mock_card_token_1234", // Replace with actual token
          description: `Funds added to account via card`,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        Swal.success("Funds Added", "Your account has been topped up successfully!")
        router.refresh() // Refresh dashboard data
      } else {
        Swal.error("Payment Failed", data.error || "Failed to add funds via card. Please try again.")
      }
    } catch (error: any) {
      console.error("Error adding funds via card:", error)
      Swal.error("Payment Failed", error.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="amount" className="mb-2 block">
          Select Amount
        </Label>
        <RadioGroup
          value={amount}
          onValueChange={handleAmountChange}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
          disabled={isLoading}
        >
          <Label
            htmlFor="amount-25"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem id="amount-25" value="25.00" className="sr-only" />
            <span className="text-xl font-bold">$25</span>
          </Label>
          <Label
            htmlFor="amount-50"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem id="amount-50" value="50.00" className="sr-only" />
            <span className="text-xl font-bold">$50</span>
          </Label>
          <Label
            htmlFor="amount-100"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem id="amount-100" value="100.00" className="sr-only" />
            <span className="text-xl font-bold">$100</span>
          </Label>
          <Label
            htmlFor="amount-250"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem id="amount-250" value="250.00" className="sr-only" />
            <span className="text-xl font-bold">$250</span>
          </Label>
          <Label
            htmlFor="amount-500"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem id="amount-500" value="500.00" className="sr-only" />
            <span className="text-xl font-bold">$500</span>
          </Label>
          <Label
            htmlFor="amount-custom"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem id="amount-custom" value={customAmount || "custom"} className="sr-only" />
            <span className="text-xl font-bold">Custom</span>
          </Label>
        </RadioGroup>
        {amount === customAmount && (
          <Input
            type="text"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={handleCustomAmountChange}
            className="mt-4"
            disabled={isLoading}
          />
        )}
      </div>

      <div>
        <Label htmlFor="paymentMethod" className="mb-2 block">
          Payment Method
        </Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value: "paypal" | "card") => setPaymentMethod(value)}
          className="grid grid-cols-2 gap-4"
          disabled={isLoading}
        >
          <Label
            htmlFor="method-paypal"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem id="method-paypal" value="paypal" className="sr-only" />
            <span className="text-xl font-bold">PayPal</span>
          </Label>
          <Label
            htmlFor="method-card"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem id="method-card" value="card" className="sr-only" />
            <span className="text-xl font-bold">Credit Card (Mock)</span>
          </Label>
        </RadioGroup>
      </div>

      {paymentMethod === "paypal" && paymentConfig.enablePaypalPayments && paymentConfig.paypalClientId ? (
        <PayPalScriptProvider options={{ clientId: paymentConfig.paypalClientId, currency: "USD" }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
            disabled={isLoading || finalAmount <= 0}
          />
        </PayPalScriptProvider>
      ) : paymentMethod === "paypal" && (!paymentConfig.enablePaypalPayments || !paymentConfig.paypalClientId) ? (
        <div className="text-red-500 text-sm">PayPal integration is not enabled or Client ID is missing.</div>
      ) : null}

      {paymentMethod === "card" && (
        <form onSubmit={handleCardPayment} className="space-y-4">
          <p className="text-sm text-gray-500">
            (This is a mock credit card payment. In a real application, you would integrate with a payment gateway like
            Stripe.)
          </p>
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input id="cardNumber" placeholder="**** **** **** ****" disabled={isLoading} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expMonth">Exp. Month</Label>
              <Input id="expMonth" placeholder="MM" disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="expYear">Exp. Year</Label>
              <Input id="expYear" placeholder="YYYY" disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="CVC" disabled={isLoading} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || finalAmount <= 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Funds...
              </>
            ) : (
              `Add $${finalAmount.toFixed(2)}`
            )}
          </Button>
        </form>
      )}

      {finalAmount <= 0 && <p className="text-red-500 text-sm">Please enter a valid amount greater than $0.00.</p>}
    </div>
  )
}
