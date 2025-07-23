import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, TrendingUp, Calendar } from "lucide-react"
import { format } from "date-fns"

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

  const getBalanceColor = (balance: number) => {
    if (balance > 100) return "text-green-600"
    if (balance > 25) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-4">
      {/* Balance Display */}
      <div className="text-center space-y-2">
        <div className={`text-2xl md:text-3xl lg:text-4xl font-bold ${getBalanceColor(balance)}`}>
          {formatCurrency(balance)}
        </div>
        <p className="text-sm text-gray-600">Available Balance</p>
      </div>

      {/* Balance Status */}
      <div className="flex items-center justify-center space-x-2 text-sm">
        <TrendingUp className={`h-4 w-4 ${getBalanceColor(balance)}`} />
        <span className="text-gray-600">
          {balance > 100 ? "Healthy balance" : balance > 25 ? "Low balance" : "Add funds needed"}
        </span>
      </div>

      {/* Last Deposit Info */}
      {lastDeposit && (
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>Last deposit: {format(new Date(lastDeposit), "MMM dd, yyyy")}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button asChild className="w-full" size="sm">
          <Link href="/dashboard/billing/add-funds">
            <Plus className="mr-2 h-4 w-4" />
            Add Funds
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full bg-transparent" size="sm">
          <Link href="/dashboard/billing">View Transaction History</Link>
        </Button>
      </div>

      {/* Balance Warning */}
      {balance < 25 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800">
            <strong>Low Balance:</strong> Add funds to continue shipping without interruption.
          </p>
        </div>
      )}
    </div>
  )
}
