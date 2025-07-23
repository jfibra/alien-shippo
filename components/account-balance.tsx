"use client"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp } from "lucide-react"
import Link from "next/link"

interface AccountBalanceProps {
  balance: number
  currency: string
  lastDeposit?: string | null
}

export function AccountBalance({ balance, currency, lastDeposit }: AccountBalanceProps) {
  const formatCurrency = (amount: number, curr: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      {/* Balance Display */}
      <div className="text-center space-y-2">
        <div className="text-3xl font-bold text-gray-900">{formatCurrency(balance, currency)}</div>
        <p className="text-sm text-gray-500">Available Balance</p>
      </div>

      {/* Last Deposit Info */}
      {lastDeposit && <div className="text-center text-xs text-gray-400">Last deposit: {formatDate(lastDeposit)}</div>}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button asChild className="w-full" size="sm">
          <Link href="/dashboard/billing/add-funds">
            <Plus className="mr-2 h-4 w-4" />
            Add Funds
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full bg-transparent" size="sm">
          <Link href="/dashboard/billing">
            <TrendingUp className="mr-2 h-4 w-4" />
            View History
          </Link>
        </Button>
      </div>

      {/* Balance Status */}
      <div className="text-center">
        {balance < 10 && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">⚠️ Low balance - Consider adding funds</div>
        )}
        {balance >= 10 && balance < 50 && (
          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">💡 Good balance for regular shipping</div>
        )}
        {balance >= 50 && (
          <div className="text-xs text-green-600 bg-green-50 p-2 rounded">✅ Excellent balance for bulk shipping</div>
        )}
      </div>
    </div>
  )
}
