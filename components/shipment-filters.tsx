"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, XCircle } from "lucide-react"

interface ShipmentFiltersProps {
  onFilterChange: (filters: {
    search?: string
    status?: string
    carrier?: string
  }) => void
}

export function ShipmentFilters({ onFilterChange }: ShipmentFiltersProps) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [carrier, setCarrier] = useState("all")

  const handleApplyFilters = () => {
    onFilterChange({
      search,
      status: status === "all" ? undefined : status,
      carrier: carrier === "all" ? undefined : carrier,
    })
  }

  const handleClearFilters = () => {
    setSearch("")
    setStatus("all")
    setCarrier("all")
    onFilterChange({}) // Clear all filters
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-md border p-4">
      <div className="relative flex-1 min-w-[180px] max-w-sm">
        <Input
          placeholder="Search shipments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_transit">In Transit</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select value={carrier} onValueChange={setCarrier}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Carrier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Carriers</SelectItem>
          <SelectItem value="USPS">USPS</SelectItem>
          <SelectItem value="UPS">UPS</SelectItem>
          <SelectItem value="FedEx">FedEx</SelectItem>
          <SelectItem value="DHL">DHL</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleApplyFilters}>Apply Filters</Button>
      {(search || status !== "all" || carrier !== "all") && (
        <Button variant="outline" onClick={handleClearFilters}>
          <XCircle className="mr-2 h-4 w-4" /> Clear Filters
        </Button>
      )}
    </div>
  )
}
