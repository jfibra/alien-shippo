import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Rocket, Zap, Globe } from "lucide-react"

interface DashboardMetricsProps {
  metrics: {
    total_shipments: number
    delivered_shipments: number
    in_transit_shipments: number
    created_shipments: number
  }
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const metricsData = [
    {
      title: "Total Missions",
      value: metrics.total_shipments,
      icon: Rocket,
      description: "Galactic deliveries launched",
      color: "text-blue-600",
    },
    {
      title: "Successfully Delivered",
      value: metrics.delivered_shipments,
      icon: CheckCircle,
      description: "Packages reached their destination",
      color: "text-green-600",
    },
    {
      title: "In Hyperspace",
      value: metrics.in_transit_shipments,
      icon: Zap,
      description: "Currently traveling through space",
      color: "text-yellow-600",
    },
    {
      title: "Awaiting Launch",
      value: metrics.created_shipments,
      icon: Globe,
      description: "Ready for intergalactic transport",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsData.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
