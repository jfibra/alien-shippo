import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Package, Eye } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface Shipment {
  id: string
  tracking_number: string | null
  carrier: string
  service: string | null
  status: string
  cost: number | null
  created_at: string
  to_address: {
    name: string
    city: string
    state: string
  } | null
}

interface RecentShipmentsProps {
  shipments: Shipment[]
}

export function RecentShipments({ shipments }: RecentShipmentsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_transit":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "created":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "exception":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 md:py-12 text-gray-500">
        <Package className="h-8 w-8 md:h-12 md:w-12 mb-4" />
        <p className="text-base md:text-lg font-medium">No recent shipments found.</p>
        <p className="text-sm text-center">Start by creating your first shipment!</p>
        <Button asChild className="mt-4" size="sm">
          <Link href="/dashboard/ship">Ship Now</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {shipments.map((shipment) => (
          <Card key={shipment.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <p className="font-medium text-sm">{shipment.tracking_number || `#${shipment.id.slice(0, 8)}`}</p>
                <p className="text-xs text-gray-600">{shipment.carrier}</p>
              </div>
              <Badge className={getStatusColor(shipment.status)}>{shipment.status.replace(/_/g, " ")}</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Destination:</span>
                <span>
                  {shipment.to_address?.city}, {shipment.to_address?.state}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost:</span>
                <span className="font-medium">${shipment.cost?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{format(new Date(shipment.created_at), "MMM dd")}</span>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full mt-3 bg-transparent">
              <Link href={`/dashboard/shipments/${shipment.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Tracking #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <Link href={`/dashboard/shipments/${shipment.id}`} className="hover:underline">
                    {shipment.tracking_number || `#${shipment.id.slice(0, 8)}`}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(shipment.status)}>{shipment.status.replace(/_/g, " ")}</Badge>
                </TableCell>
                <TableCell>{shipment.carrier}</TableCell>
                <TableCell>
                  {shipment.to_address?.city}, {shipment.to_address?.state}
                </TableCell>
                <TableCell className="text-right font-medium">${shipment.cost?.toFixed(2) || "0.00"}</TableCell>
                <TableCell className="text-right">{format(new Date(shipment.created_at), "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/dashboard/shipments/${shipment.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View All Button */}
      <div className="flex justify-center pt-4">
        <Button asChild variant="outline">
          <Link href="/dashboard/shipments" className="flex items-center space-x-2">
            <span>View All Shipments</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
