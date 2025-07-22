"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface AccountBalanceProps {
  balance: number
  currency: string
  lastDeposit: string
}

export function AccountBalance({ balance, currency, lastDeposit }: AccountBalanceProps) {
  return (
    <div className="space-y-4">
      {/* Balance Display */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <DollarSign className="h-6 w-6 text-green-600" />
          <span className="text-3xl font-bold text-gray-900">${balance.toFixed(2)}</span>
          <span className="text-lg text-gray-500">{currency}</span>
        </div>
        <p className="text-sm text-gray-600">Last deposit: {format(new Date(lastDeposit), "MMM dd, yyyy")}</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
          <Link href="/dashboard/billing/add-funds">
            <Plus className="h-4 w-4" />
            <span>Add Funds</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
          <Link href="/dashboard/billing">
            <TrendingUp className="h-4 w-4" />
            <span>View History</span>
          </Link>
        </Button>
      </div>

      {/* Balance Status */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700 font-medium">Account Active</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Your account is in good standing with sufficient funds for shipping.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
