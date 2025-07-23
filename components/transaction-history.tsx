"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface Transaction {
  id: string
  user_id: string
  amount: number
  status: string
  provider: string | null
  transaction_reference: string | null
  created_at: string
  shipment_id?: string | null
}

interface TransactionHistoryProps {
  transactions?: Transaction[]
  initialTransactions?: Transaction[]
  totalCount?: number
  userId?: string
  showFilters?: boolean
  showPagination?: boolean
}

export function TransactionHistory({
  transactions,
  initialTransactions,
  totalCount = 0,
  userId,
  showFilters = false,
  showPagination = false,
}: TransactionHistoryProps) {
  const [currentTransactions, setCurrentTransactions] = useState<Transaction[]>(
    transactions || initialTransactions || [],
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const pageSize = 10

  const filteredTransactions = currentTransactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transaction_reference?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || transaction.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredTransactions.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedTransactions = showPagination
    ? filteredTransactions.slice(startIndex, startIndex + pageSize)
    : filteredTransactions

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? "text-green-600" : "text-red-600"
  }

  if (currentTransactions.length === 0) {
    return (
      <div className="text-center py-6 md:py-8 text-muted-foreground">
        <p className="text-sm md:text-base">No transactions found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters - Only show if enabled */}
      {showFilters && (
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {paginatedTransactions.map((transaction) => (
          <Card key={transaction.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <p className="font-medium text-sm font-mono">
                  {transaction.transaction_reference || `#${transaction.id.slice(0, 8)}`}
                </p>
                <p className="text-xs text-gray-600">{format(new Date(transaction.created_at), "MMM dd, yyyy")}</p>
              </div>
              <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className={`font-medium ${getAmountColor(transaction.amount)}`}>
                  {transaction.amount >= 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Provider:</span>
                <span>{transaction.provider || "N/A"}</span>
              </div>
            </div>
            {transaction.shipment_id && (
              <Button asChild variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                <Link href={`/dashboard/shipments/${transaction.shipment_id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Shipment
                </Link>
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-gray-50">
                <TableCell>{format(new Date(transaction.created_at), "MMM dd, yyyy")}</TableCell>
                <TableCell className="font-mono text-sm">
                  {transaction.transaction_reference || `#${transaction.id.slice(0, 8)}`}
                </TableCell>
                <TableCell className={`font-medium ${getAmountColor(transaction.amount)}`}>
                  {transaction.amount >= 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                </TableCell>
                <TableCell>{transaction.provider || "N/A"}</TableCell>
                <TableCell>
                  {transaction.shipment_id && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/shipments/${transaction.shipment_id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Only show if enabled */}
      {showPagination && totalPages > 1 && (
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredTransactions.length)} of{" "}
            {filteredTransactions.length} transactions
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
