"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package } from "lucide-react"
import { format } from "date-fns"

interface Transaction {
  id: string
  user_id: string
  transaction_type: string
  amount: number
  currency: string
  created_at: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <DollarSign className="h-4 w-4 text-green-500" />
      case "debit":
        return <Package className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getTransactionDescription = (type: string, amount: number) => {
    switch (type) {
      case "deposit":
        return `Added $${amount.toFixed(2)} to account`
      case "debit":
        return `Shipping charge - $${amount.toFixed(2)}`
      default:
        return `Transaction - $${amount.toFixed(2)}`
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <DollarSign className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">No transactions found.</p>
        <p className="text-sm">Your transaction history will appear here.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium flex items-center gap-2">
                {getTransactionIcon(transaction.transaction_type)}
                {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
              </TableCell>
              <TableCell>{getTransactionDescription(transaction.transaction_type, transaction.amount)}</TableCell>
              <TableCell
                className={`text-right font-semibold ${
                  transaction.transaction_type === "deposit" ? "text-green-600" : "text-red-600"
                }`}
              >
                {transaction.transaction_type === "deposit" ? "+" : "-"}${transaction.amount.toFixed(2)}{" "}
                {transaction.currency}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Completed</Badge>
              </TableCell>
              <TableCell className="text-right">
                {format(new Date(transaction.created_at), "MMM dd, yyyy HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
