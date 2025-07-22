"use client"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp } from "lucide-react"
import Link from "next/link"

interface AccountBalanceProps {
  balance: number
  currency?: string
  lastDeposit?: string | null
}

export function AccountBalance({ balance, currency = "USD", lastDeposit }: AccountBalanceProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(balance)}</div>
        <p className="text-sm text-muted-foreground">Available Balance</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Currency:</span>
          <span className="font-medium">{currency}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Last Deposit:</span>
          <span className="font-medium">{formatDate(lastDeposit)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button asChild className="w-full">
          <Link href="/dashboard/billing/add-funds">
            <Plus className="mr-2 h-4 w-4" />
            Add Funds
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href="/dashboard/billing">
            <TrendingUp className="mr-2 h-4 w-4" />
            View History
          </Link>
        </Button>
      </div>
    </div>
  )
}
