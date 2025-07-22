"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Database, Code, Settings } from "lucide-react"

interface MockDataIssue {
  component: string
  type: "hardcoded" | "test_api" | "placeholder" | "demo_data"
  description: string
  location: string
  severity: "high" | "medium" | "low"
  recommendation: string
}

export function MockDataDetector() {
  const [mockDataIssues] = useState<MockDataIssue[]>([
    {
      component: "Shipping Rates API",
      type: "test_api",
      description: "Using mock shipping rates instead of real carrier APIs",
      location: "/app/actions/shipping-rates.ts",
      severity: "high",
      recommendation: "Integrate with USPS, UPS, or FedEx APIs for real-time rates",
    },
    {
      component: "Tracking Numbers",
      type: "demo_data",
      description: "Generating fake tracking numbers with TEST prefix",
      location: "/app/api/create-shipment/route.ts",
      severity: "high",
      recommendation: "Use real carrier APIs to generate actual tracking numbers",
    },
    {
      component: "PayPal Configuration",
      type: "test_api",
      description: "Using sandbox PayPal credentials",
      location: "/lib/config.ts",
      severity: "medium",
      recommendation: "Switch to production PayPal credentials for live payments",
    },
    {
      component: "Shippo API Key",
      type: "test_api",
      description: "Using test Shippo API key",
      location: "/lib/config.ts",
      severity: "high",
      recommendation: "Replace with production Shippo API key",
    },
    {
      component: "User Testimonials",
      type: "placeholder",
      description: "Using placeholder testimonials on homepage",
      location: "/app/page.tsx",
      severity: "low",
      recommendation: "Replace with real customer testimonials",
    },
    {
      component: "Dashboard Metrics",
      type: "demo_data",
      description: "Some metrics may show demo data for new users",
      location: "/components/dashboard-metrics.tsx",
      severity: "medium",
      recommendation: "Ensure all metrics pull from real user data",
    },
    {
      component: "Email Notifications",
      type: "placeholder",
      description: "Email notification system not implemented",
      location: "Missing implementation",
      severity: "high",
      recommendation: "Implement email service integration (SendGrid, Mailgun)",
    },
    {
      component: "Address Validation",
      type: "test_api",
      description: "Limited address validation, may use mock responses",
      location: "/app/api/validate-address/route.ts",
      severity: "medium",
      recommendation: "Integrate with USPS address validation API",
    },
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "test_api":
        return <Settings className="h-4 w-4" />
      case "demo_data":
        return <Database className="h-4 w-4" />
      case "placeholder":
        return <Code className="h-4 w-4" />
      case "hardcoded":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const highSeverityCount = mockDataIssues.filter((issue) => issue.severity === "high").length
  const mediumSeverityCount = mockDataIssues.filter((issue) => issue.severity === "medium").length
  const lowSeverityCount = mockDataIssues.filter((issue) => issue.severity === "low").length

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-navy mb-2">Mock Data Detection Report</h2>
        <p className="text-gray-600">Identified areas using test/mock data that need production implementation</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{mockDataIssues.length}</div>
            <div className="text-sm text-gray-500">Total Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{highSeverityCount}</div>
            <div className="text-sm text-gray-500">High Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{mediumSeverityCount}</div>
            <div className="text-sm text-gray-500">Medium Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{lowSeverityCount}</div>
            <div className="text-sm text-gray-500">Low Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alert */}
      {highSeverityCount > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Production Readiness Warning</AlertTitle>
          <AlertDescription>
            {highSeverityCount} high-priority issues found that must be resolved before going live. These involve core
            functionality using test/mock data.
          </AlertDescription>
        </Alert>
      )}

      {/* Issues List */}
      <div className="space-y-4">
        {mockDataIssues.map((issue, index) => (
          <Card key={index} className={issue.severity === "high" ? "border-red-200" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getTypeIcon(issue.type)}
                  {issue.component}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={getSeverityColor(issue.severity)}>{issue.severity} priority</Badge>
                  <Badge variant="outline">{issue.type.replace("_", " ")}</Badge>
                </div>
              </div>
              <CardDescription>{issue.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-sm">Location: </span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{issue.location}</code>
                </div>
                <div>
                  <span className="font-medium text-sm text-green-700">Recommendation: </span>
                  <span className="text-sm">{issue.recommendation}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
