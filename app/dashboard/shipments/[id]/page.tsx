import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getShipmentDetails } from "@/lib/shipping-service"
import { getSession } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Shipment Details - Viking Freight Dashboard",
  description: "View detailed information about your specific shipment.",
}

export default async function ShipmentDetailsPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const shipment = await getShipmentDetails(params.id, session.user.id)

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h2 className="text-2xl font-bold mb-4">Shipment Not Found</h2>
        <p className="text-gray-600">
          The shipment you are looking for does not exist or you do not have access to it.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Shipment #{shipment.tracking_number || shipment.id.substring(0, 8)}
            <Badge
              variant={
                shipment.status === "delivered" ? "success" : shipment.status === "in_transit" ? "secondary" : "default"
              }
            >
              {shipment.status.replace(/_/g, " ")}
            </Badge>
          </CardTitle>
          <CardDescription>Details for your shipment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Carrier:</p>
                <p className="font-medium">{shipment.carrier}</p>
              </div>
              <div>
                <p className="text-gray-500">Service Level:</p>
                <p className="font-medium">{shipment.service_level}</p>
              </div>
              <div>
                <p className="text-gray-500">Tracking Number:</p>
                <p className="font-medium">{shipment.tracking_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Cost:</p>
                <p className="font-medium">
                  ${shipment.cost.toFixed(2)} {shipment.currency}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Created At:</p>
                <p className="font-medium">{format(new Date(shipment.created_at), "PPP p")}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated:</p>
                <p className="font-medium">{format(new Date(shipment.updated_at), "PPP p")}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Addresses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">From Address:</p>
                <p className="font-medium">{shipment.from_address.name}</p>
                <p>{shipment.from_address.street1}</p>
                {shipment.from_address.street2 && <p>{shipment.from_address.street2}</p>}
                <p>
                  {shipment.from_address.city}, {shipment.from_address.state} {shipment.from_address.zip}
                </p>
                <p>{shipment.from_address.country}</p>
              </div>
              <div>
                <p className="text-gray-500">To Address:</p>
                <p className="font-medium">{shipment.to_address.name}</p>
                <p>{shipment.to_address.street1}</p>
                {shipment.to_address.street2 && <p>{shipment.to_address.street2}</p>}
                <p>
                  {shipment.to_address.city}, {shipment.to_address.state} {shipment.to_address.zip}
                </p>
                <p>{shipment.to_address.country}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Parcel Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Weight:</p>
                <p className="font-medium">
                  {shipment.parcel_weight} {shipment.parcel_mass_unit}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Dimensions:</p>
                <p className="font-medium">
                  {shipment.parcel_length}x{shipment.parcel_width}x{shipment.parcel_height}{" "}
                  {shipment.parcel_distance_unit}
                </p>
              </div>
            </div>
          </div>

          {shipment.tracking_history && shipment.tracking_history.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Tracking History</h3>
                <div className="space-y-2">
                  {shipment.tracking_history.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="flex-shrink-0 text-gray-500">
                        {format(new Date(event.timestamp), "MMM dd, yyyy")}
                        <br />
                        {format(new Date(event.timestamp), "hh:mm a")}
                      </div>
                      <div>
                        <p className="font-medium">{event.status}</p>
                        <p className="text-gray-600">{event.location}</p>
                        {event.description && <p className="text-gray-500 text-xs">{event.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
