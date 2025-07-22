"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Filter, Download } from "lucide-react"

// Define a type for the transaction data
interface Transaction {
  id: string
  user_id: string
  transaction_type: "deposit" | "debit"
  amount: number
  currency: string
  created_at: string
  provider: string | null
  shipments: {
    id: string
    tracking_number: string
    status: string
    carrier: string
  } | null
}

interface BillingPageClientProps {
  initialTransactions: Transaction[]
  userId: string
}

export function BillingPageClient({ initialTransactions, userId }: BillingPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredTransactions = initialTransactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.shipments?.tracking_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transaction_type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || transaction.transaction_type === filterType

    return matchesSearch && matchesFilter
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
        <CardDescription>A complete history of your account transactions.</CardDescription>
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter by Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter Transactions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterType("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("deposit")}>Deposits</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("debit")}>Debits</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No transactions found matching your criteria.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Provider/Carrier</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.transaction_type === "deposit" ? "success" : "destructive"}
                      className="capitalize"
                    >
                      {transaction.transaction_type}
                    </Badge>
                  </TableCell>
                  <TableCell className={transaction.transaction_type === "deposit" ? "text-green-600" : "text-red-600"}>
                    {transaction.transaction_type === "deposit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.transaction_type === "deposit"
                      ? "Funds Added"
                      : `Label Purchase ${transaction.shipments?.tracking_number ? `(Tracking: ${transaction.shipments.tracking_number})` : ""}`}
                  </TableCell>
                  <TableCell>{transaction.provider || transaction.shipments?.carrier || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {transaction.shipments?.id && (
                          <DropdownMenuItem onClick={() => alert(`View shipment ${transaction.shipments?.id}`)}>
                            View Shipment
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => alert(`Download receipt for ${transaction.id}`)}>
                          Download Receipt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
