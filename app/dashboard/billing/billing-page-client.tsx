"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Download, CalendarIcon, CreditCard, TrendingUp, ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

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

interface BillingPageClientProps {
  initialTransactions: Transaction[]
  userId: string
  currentBalance: number
}

export function BillingPageClient({ initialTransactions, userId, currentBalance }: BillingPageClientProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(initialTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const pageSize = 20

  // Filter transactions
  useEffect(() => {
    let filtered = transactions

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.transaction_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.provider?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Type filter (deposit/payment)
    if (filterType !== "all") {
      if (filterType === "deposit") {
        filtered = filtered.filter((t) => t.amount > 0)
      } else if (filterType === "payment") {
        filtered = filtered.filter((t) => t.amount < 0)
      }
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((t) => t.status === filterStatus)
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter((t) => new Date(t.created_at) >= dateRange.from!)
    }
    if (dateRange.to) {
      filtered = filtered.filter((t) => new Date(t.created_at) <= dateRange.to!)
    }

    setFilteredTransactions(filtered)
    setCurrentPage(1)
  }, [transactions, searchTerm, filterType, filterStatus, dateRange])

  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const totalPages = Math.ceil(filteredTransactions.length / pageSize)

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

  const exportTransactions = () => {
    const csvContent = [
      ["Date", "Type", "Amount", "Status", "Provider", "Reference", "Shipment ID"].join(","),
      ...filteredTransactions.map((t) =>
        [
          format(new Date(t.created_at), "yyyy-MM-dd HH:mm:ss"),
          t.amount > 0 ? "Deposit" : "Payment",
          t.amount.toFixed(2),
          t.status,
          t.provider || "",
          t.transaction_reference || "",
          t.shipment_id || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const loadMoreTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/transactions?page=${Math.floor(transactions.length / 20) + 1}&limit=20`)
      if (response.ok) {
        const newTransactions = await response.json()
        setTransactions((prev) => [...prev, ...newTransactions])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load more transactions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate summary stats
  const totalDeposits = filteredTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)

  const totalPayments = Math.abs(filteredTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Billing & Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account balance and view transaction history.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/billing/add-funds">
            <Plus className="mr-2 h-4 w-4" />
            Add Funds
          </Link>
        </Button>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Available for shipping</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+${totalDeposits.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Funds added</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-${totalPayments.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">On shipping</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Pick a date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange(range || {})}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("all")
                  setFilterStatus("all")
                  setDateRange({})
                }}
              >
                Clear Filters
              </Button>
              <Button variant="outline" size="sm" onClick={exportTransactions}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction History</CardTitle>
          <CardDescription>Complete history of your account transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {paginatedTransactions.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">No transactions match your current filters.</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-4">
                {paginatedTransactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{transaction.amount > 0 ? "Deposit" : "Payment"}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(transaction.created_at), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                        </div>
                      </div>
                      {transaction.provider && <p className="text-sm text-gray-600">Via {transaction.provider}</p>}
                      {transaction.transaction_reference && (
                        <p className="text-xs text-gray-500 font-mono">Ref: {transaction.transaction_reference}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{format(new Date(transaction.created_at), "MMM dd, yyyy HH:mm")}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {transaction.amount > 0 ? (
                              <ArrowUpRight className="h-4 w-4 text-green-600 mr-2" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4 text-red-600 mr-2" />
                            )}
                            {transaction.amount > 0 ? "Deposit" : "Payment"}
                          </div>
                        </TableCell>
                        <TableCell
                          className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                        </TableCell>
                        <TableCell>{transaction.provider || "N/A"}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {transaction.transaction_reference || "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.shipment_id && (
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/dashboard/shipments/${transaction.shipment_id}`}>View Shipment</Link>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Load More Button */}
              {transactions.length >= 20 && (
                <div className="text-center mt-6">
                  <Button variant="outline" onClick={loadMoreTransactions} disabled={isLoading}>
                    {isLoading ? "Loading..." : "Load More Transactions"}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
