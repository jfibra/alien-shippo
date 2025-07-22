"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Swal } from "@/components/sweet-alert"
import { useRouter } from "next/navigation"

interface BankTransferFormProps {
  userId: string
}

export function BankTransferForm({ userId }: BankTransferFormProps) {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [reference, setReference] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real application, this would initiate a bank transfer process
    // and likely involve a backend API call to record the pending transfer.
    // For this mock, we'll simulate a successful initiation.
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Here you would typically record the bank transfer request in your DB
      // with a 'pending' status, waiting for actual bank confirmation.
      console.log(`Bank transfer initiated for user ${userId}: Amount ${amount}, Reference ${reference}`)

      Swal.success(
        "Transfer Initiated",
        "Your bank transfer request has been received. Please complete the transfer using the details provided. Your balance will be updated once the transfer is confirmed.",
      )
      setAmount("")
      setReference("")
      router.refresh() // Refresh any balance display
    } catch (error: any) {
      console.error("Bank transfer initiation error:", error)
      Swal.error("Transfer Failed", error.message || "Failed to initiate bank transfer. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="amount">Amount to Transfer</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="e.g., 100.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="reference">Reference/Memo (Optional)</Label>
        <Input
          id="reference"
          type="text"
          placeholder="e.g., Funds for shipping"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
        <h3 className="mb-2 font-semibold">Bank Transfer Instructions:</h3>
        <p>Please transfer funds to the following account:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Bank Name: Mock Bank Inc.</li>
          <li>Account Name: Viking Freight, LLC</li>
          <li>Account Number: 1234567890</li>
          <li>Routing Number: 098765432</li>
          <li>SWIFT/BIC: MOCKUS33</li>
        </ul>
        <p className="mt-2 font-semibold">
          Important: Include your User ID ({userId.substring(0, 8)}...) as the reference/memo for us to identify your
          payment.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Initiating Transfer...
          </>
        ) : (
          "Initiate Bank Transfer"
        )}
      </Button>
    </form>
  )
}
