"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, ArrowUpRight, ArrowDownLeft, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  amount: number
  status: string
  provider?: string
  transaction_reference?: string
  created_at: string
  shipment_id?: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
  userId: string
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTransactionIcon = (amount: number) => {
    return amount > 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownLeft className="h-4 w-4 text-red-600" />
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
        <p className="text-gray-500 mb-4">Your transaction history will appear here.</p>
        <Button asChild>
          <Link href="/dashboard/billing/add-funds">Add Funds</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
              {/* Left side - Transaction info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.amount)}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                    <span className="font-medium">{transaction.amount > 0 ? "Deposit" : "Payment"}</span>
                    <Badge className={getStatusColor(transaction.status)} variant="secondary">
                      {transaction.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Provider and reference */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500">
                  {transaction.provider && <span className="capitalize">{transaction.provider}</span>}
                  {transaction.transaction_reference && (
                    <span className="font-mono text-xs">Ref: {transaction.transaction_reference}</span>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Right side - Amount and actions */}
              <div className="flex items-center justify-between lg:justify-end lg:space-x-4">
                <div className="text-right">
                  <div className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/billing/transactions/${transaction.id}`}>
                    <ExternalLink className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">View</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
