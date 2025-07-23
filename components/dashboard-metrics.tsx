"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CheckCircle, Truck, Clock } from "lucide-react"

interface DashboardMetricsProps {
  metrics: {
    total_shipments: number
    delivered_shipments: number
    in_transit_shipments: number
    created_shipments: number
  }
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const cards = [
    {
      title: "Total Shipments",
      value: metrics.total_shipments,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Delivered",
      value: metrics.delivered_shipments,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "In Transit",
      value: metrics.in_transit_shipments,
      icon: Truck,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Pending",
      value: metrics.created_shipments,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 truncate">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.title.toLowerCase()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
