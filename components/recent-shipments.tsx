import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Package } from "lucide-react"
import type { Shipment } from "@/lib/types"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface RecentShipmentsProps {
  shipments: Shipment[]
}

export function RecentShipments({ shipments }: RecentShipmentsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Recent Shipments</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/shipments">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">Your latest shipping activities at a glance.</CardDescription>
        {shipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Package className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No recent shipments found.</p>
            <p className="text-sm">Start by creating your first shipment!</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/ship">Ship Now</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/shipments/${shipment.id}`} className="hover:underline">
                        {shipment.tracking_number || shipment.id.substring(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          shipment.status === "delivered"
                            ? "success"
                            : shipment.status === "in_transit"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {shipment.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{shipment.carrier}</TableCell>
                    <TableCell>
                      {shipment.to_address.city}, {shipment.to_address.state}
                    </TableCell>
                    <TableCell className="text-right">${shipment.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(shipment.created_at), "MMM dd, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
