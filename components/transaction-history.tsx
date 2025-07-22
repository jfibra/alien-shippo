"use client"

import { useState, useTransition } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type Transaction = {
  id: string
  created_at: string
  transaction_type: string
  amount: number
  currency: string
  status?: string
}

interface TransactionHistoryProps {
  /* NEW props – used by the billing page */
  initialTransactions?: Transaction[]
  totalCount?: number
  /* LEGACY prop – still used on /dashboard and elsewhere */
  transactions?: Transaction[]
  /* Needed for client-side “Load more” */
  userId: string
}

export function TransactionHistory({
  initialTransactions,
  transactions: legacyTransactions,
  totalCount: totalCountProp,
  userId,
}: TransactionHistoryProps) {
  /* Accept either prop name; fall back to an empty array so .length is always safe */
  const initial = initialTransactions ?? legacyTransactions ?? []
  const totalCount = totalCountProp ?? initial.length

  const [transactions, setTransactions] = useState<Transaction[]>(initial)
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()
  const pageSize = 10

  const hasMore = transactions.length < totalCount

  const loadMore = () => {
    startTransition(async () => {
      try {
        const nextPage = page + 1
        const res = await fetch(`/api/transactions?page=${nextPage}&pageSize=${pageSize}&userId=${userId}`, {
          cache: "no-store",
        })

        if (!res.ok) throw new Error("Failed to load more transactions")

        const { transactions: newTx = [] } = (await res.json()) as {
          transactions: Transaction[]
        }

        if (newTx.length) {
          setTransactions((prev) => [...prev, ...newTx])
          setPage(nextPage)
        }
      } catch (error) {
        console.error("Load-more error:", error)
      }
    })
  }

  if (transactions.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No transactions found.</div>
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="capitalize">{tx.transaction_type}</TableCell>
              <TableCell className={`text-right font-medium ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                {tx.amount > 0 ? "+" : ""}
                {tx.amount.toFixed(2)} {tx.currency}
              </TableCell>
              <TableCell className="capitalize">{tx.status ?? "complete"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {hasMore && (
        <div className="text-center mt-4">
          <Button onClick={loadMore} disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
