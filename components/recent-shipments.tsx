"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, MapPin, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Shipment {
  id: string
  tracking_number?: string
  status: string
  carrier?: string
  service?: string
  cost?: number
  created_at: string
  from_address?: {
    name: string
    city: string
    state: string
  }
  to_address?: {
    name: string
    city: string
    state: string
  }
}

interface RecentShipmentsProps {
  shipments: Shipment[]
}

export function RecentShipments({ shipments }: RecentShipmentsProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "created":
        return "bg-gray-100 text-gray-800"
      case "exception":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (shipments.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments yet</h3>
        <p className="text-gray-500 mb-4">Create your first shipment to get started.</p>
        <Button asChild>
          <Link href="/dashboard/ship">Create Shipment</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {shipments.map((shipment) => (
        <Card key={shipment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
              {/* Left side - Shipment info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                    <span className="font-medium">
                      {shipment.tracking_number || `Shipment ${shipment.id.slice(0, 8)}`}
                    </span>
                    <Badge className={getStatusColor(shipment.status)} variant="secondary">
                      {shipment.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Route info */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">
                    {shipment.from_address?.city}, {shipment.from_address?.state} → {shipment.to_address?.city},{" "}
                    {shipment.to_address?.state}
                  </span>
                </div>

                {/* Service and date */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500">
                  {shipment.carrier && (
                    <span>
                      {shipment.carrier} {shipment.service}
                    </span>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(shipment.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Right side - Cost and actions */}
              <div className="flex items-center justify-between lg:justify-end lg:space-x-4">
                {shipment.cost && (
                  <div className="text-right">
                    <div className="font-semibold">${shipment.cost.toFixed(2)}</div>
                  </div>
                )}
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/shipments/${shipment.id}`}>
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
