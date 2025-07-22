import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Search, ArrowUpDown, Plus, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ShipmentFilters } from "@/components/shipment-filters"
import { formatDate } from "@/lib/utils"

// Mock data for shipments
const mockShipments = [
  {
    id: "ship_1",
    user_id: "mock_user_1",
    tracking_number: "TRK123456789",
    carrier: "USPS",
    service_name: "Priority Mail",
    status: "delivered",
    from_address_id: "addr_from_1",
    to_address_id: "addr_to_1",
    package_details: { weight: 5, type: "parcel" },
    cost: 15.5,
    currency: "USD",
    created_at: "2024-07-19T14:30:00Z",
    updated_at: "2024-07-21T10:00:00Z",
    estimated_delivery: "2024-07-21T00:00:00Z",
    actual_delivery: "2024-07-21T10:00:00Z",
    label_url: "#",
    tracking_url: "#",
    to_address: { name: "Alice Smith", city: "New York", state: "NY" },
  },
  {
    id: "ship_2",
    user_id: "mock_user_1",
    tracking_number: "TRK987654321",
    carrier: "UPS",
    service_name: "Ground",
    status: "in_transit",
    from_address_id: "addr_from_1",
    to_address_id: "addr_to_2",
    package_details: { weight: 10, type: "parcel" },
    cost: 22.75,
    currency: "USD",
    created_at: "2024-07-17T11:00:00Z",
    updated_at: "2024-07-20T08:00:00Z",
    estimated_delivery: "2024-07-23T00:00:00Z",
    actual_delivery: null,
    label_url: "#",
    tracking_url: "#",
    to_address: { name: "Bob Johnson", city: "Los Angeles", state: "CA" },
  },
  {
    id: "ship_3",
    user_id: "mock_user_1",
    tracking_number: "TRK112233445",
    carrier: "FedEx",
    service_name: "Express Saver",
    status: "created",
    from_address_id: "addr_from_2",
    to_address_id: "addr_to_3",
    package_details: { weight: 2, type: "letter" },
    cost: 5.2,
    currency: "USD",
    created_at: "2024-07-16T16:00:00Z",
    updated_at: "2024-07-16T16:00:00Z",
    estimated_delivery: "2024-07-22T00:00:00Z",
    actual_delivery: null,
    label_url: "#",
    tracking_url: "#",
    to_address: { name: "Charlie Brown", city: "Chicago", state: "IL" },
  },
]

export default function ShipmentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse search params
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const status = typeof searchParams.status === "string" ? searchParams.status : ""
  const carrier = typeof searchParams.carrier === "string" ? searchParams.carrier : ""
  const sortBy = typeof searchParams.sortBy === "string" ? searchParams.sortBy : "created_at"
  const sortOrder = typeof searchParams.sortOrder === "string" ? searchParams.sortOrder : "desc"
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const limit = 10
  const offset = (page - 1) * limit

  // Filter and sort mock data
  const filteredAndSortedShipments = mockShipments.filter((shipment) => {
    const matchesSearch =
      !search ||
      shipment.tracking_number?.toLowerCase().includes(search.toLowerCase()) ||
      shipment.to_address?.name?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = !status || shipment.status === status
    const matchesCarrier = !carrier || shipment.carrier === carrier

    return matchesSearch && matchesStatus && matchesCarrier
  })

  // Apply sorting
  filteredAndSortedShipments.sort((a, b) => {
    let valA: any, valB: any
    if (sortBy === "tracking_number") {
      valA = a.tracking_number || ""
      valB = b.tracking_number || ""
    } else if (sortBy === "carrier") {
      valA = a.carrier || ""
      valB = b.carrier || ""
    } else if (sortBy === "status") {
      valA = a.status || ""
      valB = b.status || ""
    } else {
      valA = a.created_at
      valB = b.created_at
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1
    if (valA > valB) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const shipments = filteredAndSortedShipments.slice(offset, offset + limit)
  const count = filteredAndSortedShipments.length
  const totalPages = count ? Math.ceil(count / limit) : 0

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">Shipments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track all your shipments</p>
        </div>
        <Button asChild variant="gold" className="w-full sm:w-auto">
          <Link href="/dashboard/ship">
            <Plus className="mr-2 h-4 w-4" />
            Create Shipment
          </Link>
        </Button>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <form action="/dashboard/shipments" method="get">
                <Input
                  type="search"
                  name="search"
                  placeholder="Search by tracking number or recipient..."
                  className="pl-9"
                  defaultValue={search}
                />
                {status && <input type="hidden" name="status" value={status} />}
                {carrier && <input type="hidden" name="carrier" value={carrier} />}
                {sortBy && <input type="hidden" name="sortBy" value={sortBy} />}
                {sortOrder && <input type="hidden" name="sortOrder" value={sortOrder} />}
              </form>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <ShipmentFilters
                currentStatus={status}
                currentCarrier={carrier}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {shipments && shipments.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <div className="flex items-center">
                        Tracking #
                        <Link
                          href={`/dashboard/shipments?sortBy=tracking_number&sortOrder=${sortBy === "tracking_number" && sortOrder === "asc" ? "desc" : "asc"}`}
                          className="ml-1"
                        >
                          <ArrowUpDown className="h-3 w-3" />
                        </Link>
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <div className="flex items-center">
                        Carrier & Service
                        <Link
                          href={`/dashboard/shipments?sortBy=carrier&sortOrder=${sortBy === "carrier" && sortOrder === "asc" ? "desc" : "asc"}`}
                          className="ml-1"
                        >
                          <ArrowUpDown className="h-3 w-3" />
                        </Link>
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">To</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <div className="flex items-center">
                        Status
                        <Link
                          href={`/dashboard/shipments?sortBy=status&sortOrder=${sortBy === "status" && sortOrder === "asc" ? "desc" : "asc"}`}
                          className="ml-1"
                        >
                          <ArrowUpDown className="h-3 w-3" />
                        </Link>
                      </div>
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((shipment) => (
                    <tr key={shipment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{formatDate(shipment.created_at)}</td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-xs">{shipment.tracking_number || "N/A"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{shipment.carrier || "N/A"}</div>
                        <div className="text-gray-500 text-xs">{shipment.service_name || "N/A"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{shipment.to_address?.name || "N/A"}</div>
                        <div className="text-gray-500 text-xs">
                          {shipment.to_address ? `${shipment.to_address.city}, ${shipment.to_address.state}` : "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            shipment.status === "delivered"
                              ? "default"
                              : shipment.status === "in_transit"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {shipment.status || "N/A"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/shipments/${shipment.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {shipments.map((shipment) => (
              <Card key={shipment.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <p className="font-medium text-sm truncate">{shipment.tracking_number || "No tracking"}</p>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{formatDate(shipment.created_at)}</p>
                      </div>
                      <Badge
                        variant={
                          shipment.status === "delivered"
                            ? "default"
                            : shipment.status === "in_transit"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {shipment.status || "N/A"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Carrier & Service</p>
                        <p className="text-sm font-medium">{shipment.carrier || "N/A"}</p>
                        <p className="text-xs text-gray-500">{shipment.service_name || "N/A"}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">To</p>
                        <p className="text-sm font-medium">{shipment.to_address?.name || "N/A"}</p>
                        <p className="text-xs text-gray-500">
                          {shipment.to_address ? `${shipment.to_address.city}, ${shipment.to_address.state}` : "N/A"}
                        </p>
                      </div>
                    </div>

                    <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                      <Link href={`/dashboard/shipments/${shipment.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, count || 0)} of {count || 0} shipments
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/dashboard/shipments?page=${page - 1}&search=${search}&status=${status}&carrier=${carrier}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
                    >
                      Previous
                    </Link>
                  </Button>
                )}

                <div className="flex items-center text-sm px-3 py-1 bg-gray-100 rounded">
                  Page {page} of {totalPages}
                </div>

                {page < totalPages && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/dashboard/shipments?page=${page + 1}&search=${search}&status=${status}&carrier=${carrier}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
                    >
                      Next
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No shipments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search || status || carrier
              ? "Try adjusting your search or filters"
              : "Create your first shipment to get started"}
          </p>
          <Button asChild variant="gold" className="mt-6">
            <Link href="/dashboard/ship">
              <Plus className="mr-2 h-4 w-4" />
              Create Shipment
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
