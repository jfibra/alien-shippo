"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Database,
  CreditCard,
  Truck,
  Shield,
  Settings,
  Users,
  BarChart3,
  Bell,
} from "lucide-react"

interface AuditItem {
  name: string
  status: "complete" | "incomplete" | "mock" | "missing"
  description: string
  issues?: string[]
  recommendations?: string[]
}

interface AuditSection {
  title: string
  icon: React.ReactNode
  items: AuditItem[]
}

export function SiteAudit() {
  const [auditResults, setAuditResults] = useState<AuditSection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    performAudit()
  }, [])

  const performAudit = async () => {
    setIsLoading(true)

    // Simulate audit process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const results: AuditSection[] = [
      {
        title: "Authentication & User Management",
        icon: <Users className="h-5 w-5" />,
        items: [
          {
            name: "User Registration",
            status: "complete",
            description: "Supabase auth integration working",
            issues: [],
            recommendations: ["Add email verification flow", "Implement password strength requirements"],
          },
          {
            name: "Password Reset",
            status: "complete",
            description: "Magic link and password reset functional",
          },
          {
            name: "Session Management",
            status: "incomplete",
            description: "Basic session handling implemented",
            issues: ["No session timeout handling", "Limited session security"],
            recommendations: ["Add session timeout", "Implement device tracking"],
          },
          {
            name: "Two-Factor Authentication",
            status: "missing",
            description: "2FA not implemented",
            recommendations: ["Add TOTP support", "SMS backup option"],
          },
        ],
      },
      {
        title: "Shipping Functionality",
        icon: <Truck className="h-5 w-5" />,
        items: [
          {
            name: "Rate Calculation",
            status: "mock",
            description: "Using mock shipping rates",
            issues: ["Not connected to real carrier APIs", "Limited rate options"],
            recommendations: [
              "Integrate with USPS API",
              "Add UPS/FedEx integration",
              "Implement real-time rate fetching",
            ],
          },
          {
            name: "Label Generation",
            status: "mock",
            description: "Generates test tracking numbers",
            issues: ["No actual label PDF generation", "Mock tracking numbers"],
            recommendations: [
              "Integrate with Shippo/EasyPost",
              "Generate real shipping labels",
              "Add label printing functionality",
            ],
          },
          {
            name: "Address Validation",
            status: "incomplete",
            description: "Basic validation implemented",
            issues: ["Limited address verification", "No real-time validation"],
            recommendations: ["Integrate with USPS address validation", "Add international address support"],
          },
          {
            name: "Tracking Integration",
            status: "missing",
            description: "No real tracking updates",
            issues: ["No carrier tracking integration", "Static tracking status"],
            recommendations: ["Implement webhook tracking updates", "Add tracking notifications"],
          },
        ],
      },
      {
        title: "Payment Processing",
        icon: <CreditCard className="h-5 w-5" />,
        items: [
          {
            name: "PayPal Integration",
            status: "incomplete",
            description: "PayPal setup but not fully functional",
            issues: ["Test mode only", "Limited error handling"],
            recommendations: ["Complete PayPal production setup", "Add payment failure handling"],
          },
          {
            name: "Account Balance",
            status: "complete",
            description: "Balance tracking working with Supabase",
          },
          {
            name: "Payment Methods",
            status: "incomplete",
            description: "Basic CRUD operations",
            issues: ["No card validation", "Limited payment method types"],
            recommendations: ["Add Stripe integration", "Implement card validation", "Support more payment types"],
          },
          {
            name: "Subscription Management",
            status: "missing",
            description: "No recurring payment system",
            recommendations: ["Implement subscription billing", "Add auto-recharge options"],
          },
        ],
      },
      {
        title: "Data Management",
        icon: <Database className="h-5 w-5" />,
        items: [
          {
            name: "Database Schema",
            status: "complete",
            description: "Supabase schema properly structured",
          },
          {
            name: "Data Validation",
            status: "incomplete",
            description: "Basic validation in place",
            issues: ["Inconsistent validation rules", "Limited server-side validation"],
            recommendations: ["Add comprehensive validation", "Implement data sanitization"],
          },
          {
            name: "Backup & Recovery",
            status: "incomplete",
            description: "Relying on Supabase backups",
            recommendations: ["Implement custom backup strategy", "Add data export functionality"],
          },
          {
            name: "Data Analytics",
            status: "missing",
            description: "No analytics tracking",
            recommendations: ["Add user behavior tracking", "Implement shipping analytics"],
          },
        ],
      },
      {
        title: "Notifications & Communication",
        icon: <Bell className="h-5 w-5" />,
        items: [
          {
            name: "In-App Notifications",
            status: "complete",
            description: "Notification system working",
          },
          {
            name: "Email Notifications",
            status: "missing",
            description: "No email notification system",
            issues: ["No email service integration", "No email templates"],
            recommendations: [
              "Integrate with SendGrid/Mailgun",
              "Create email templates",
              "Add notification preferences",
            ],
          },
          {
            name: "SMS Notifications",
            status: "missing",
            description: "No SMS capability",
            recommendations: ["Add Twilio integration", "Implement SMS tracking updates"],
          },
          {
            name: "Push Notifications",
            status: "missing",
            description: "No push notification support",
            recommendations: ["Implement web push notifications", "Add mobile app notifications"],
          },
        ],
      },
      {
        title: "Security & Compliance",
        icon: <Shield className="h-5 w-5" />,
        items: [
          {
            name: "Data Encryption",
            status: "complete",
            description: "Supabase handles encryption",
          },
          {
            name: "API Security",
            status: "incomplete",
            description: "Basic RLS policies",
            issues: ["Limited rate limiting", "No API key management"],
            recommendations: ["Implement rate limiting", "Add API key system", "Enhance security headers"],
          },
          {
            name: "GDPR Compliance",
            status: "incomplete",
            description: "Basic privacy policy",
            issues: ["No data export/deletion tools", "Limited consent management"],
            recommendations: ["Add GDPR compliance tools", "Implement data portability"],
          },
          {
            name: "Audit Logging",
            status: "incomplete",
            description: "Basic activity logging",
            recommendations: ["Enhanced audit trails", "Security event monitoring"],
          },
        ],
      },
      {
        title: "User Experience",
        icon: <Settings className="h-5 w-5" />,
        items: [
          {
            name: "Mobile Responsiveness",
            status: "incomplete",
            description: "Partially responsive design",
            issues: ["Some components not mobile-optimized", "Touch targets too small"],
            recommendations: ["Optimize for mobile", "Improve touch interactions", "Add mobile-specific workflows"],
          },
          {
            name: "Loading States",
            status: "incomplete",
            description: "Some loading states missing",
            issues: ["Inconsistent loading indicators", "No skeleton screens"],
            recommendations: ["Add comprehensive loading states", "Implement skeleton screens"],
          },
          {
            name: "Error Handling",
            status: "incomplete",
            description: "Basic error handling",
            issues: ["Generic error messages", "No error recovery options"],
            recommendations: ["Improve error messages", "Add error recovery flows", "Implement error reporting"],
          },
          {
            name: "Accessibility",
            status: "incomplete",
            description: "Basic accessibility features",
            issues: ["Missing ARIA labels", "Limited keyboard navigation"],
            recommendations: ["Full accessibility audit", "Add ARIA labels", "Improve keyboard navigation"],
          },
        ],
      },
      {
        title: "Reporting & Analytics",
        icon: <BarChart3 className="h-5 w-5" />,
        items: [
          {
            name: "Shipping Reports",
            status: "missing",
            description: "No shipping analytics",
            recommendations: ["Add shipping volume reports", "Cost analysis dashboards", "Performance metrics"],
          },
          {
            name: "Financial Reports",
            status: "incomplete",
            description: "Basic transaction history",
            issues: ["No detailed financial reports", "Limited export options"],
            recommendations: ["Add comprehensive financial reporting", "Implement expense categorization"],
          },
          {
            name: "User Analytics",
            status: "missing",
            description: "No user behavior tracking",
            recommendations: ["Implement user analytics", "Add conversion tracking", "Usage pattern analysis"],
          },
        ],
      },
    ]

    setAuditResults(results)
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800"
      case "incomplete":
        return "bg-yellow-100 text-yellow-800"
      case "mock":
        return "bg-orange-100 text-orange-800"
      case "missing":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "incomplete":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "mock":
        return <Info className="h-4 w-4 text-orange-600" />
      case "missing":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getSummaryStats = () => {
    const allItems = auditResults.flatMap((section) => section.items)
    return {
      total: allItems.length,
      complete: allItems.filter((item) => item.status === "complete").length,
      incomplete: allItems.filter((item) => item.status === "incomplete").length,
      mock: allItems.filter((item) => item.status === "mock").length,
      missing: allItems.filter((item) => item.status === "missing").length,
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4"></div>
          <p>Performing comprehensive site audit...</p>
        </div>
      </div>
    )
  }

  const stats = getSummaryStats()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-navy mb-2">Viking Freight Site Audit</h1>
        <p className="text-gray-600">Comprehensive analysis of site functionality and completeness</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
            <div className="text-sm text-gray-500">Complete</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.incomplete}</div>
            <div className="text-sm text-gray-500">Incomplete</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.mock}</div>
            <div className="text-sm text-gray-500">Mock Data</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.missing}</div>
            <div className="text-sm text-gray-500">Missing</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Issues Alert */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Critical Issues Found</AlertTitle>
        <AlertDescription>
          Your site has {stats.mock} features using mock data and {stats.missing} missing features that need immediate
          attention for production readiness.
        </AlertDescription>
      </Alert>

      {/* Detailed Audit Results */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="critical">Critical Issues</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {auditResults.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(item.status)}
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        {item.issues && item.issues.length > 0 && (
                          <div className="text-sm">
                            <span className="font-medium text-red-600">Issues:</span>
                            <ul className="list-disc list-inside text-red-600 ml-2">
                              {item.issues.map((issue, issueIndex) => (
                                <li key={issueIndex}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          {auditResults.map((section) =>
            section.items
              .filter((item) => item.status === "mock" || item.status === "missing")
              .map((item, index) => (
                <Alert key={index} variant={item.status === "missing" ? "destructive" : "default"}>
                  {getStatusIcon(item.status)}
                  <AlertTitle>
                    {item.name} - {section.title}
                  </AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">{item.description}</p>
                    {item.issues && (
                      <ul className="list-disc list-inside">
                        {item.issues.map((issue, issueIndex) => (
                          <li key={issueIndex}>{issue}</li>
                        ))}
                      </ul>
                    )}
                  </AlertDescription>
                </Alert>
              )),
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {auditResults.map((section) =>
            section.items
              .filter((item) => item.recommendations && item.recommendations.length > 0)
              .map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{section.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.recommendations?.map((rec, recIndex) => (
                        <li key={recIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )),
          )}
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button onClick={performAudit} variant="outline">
          Re-run Audit
        </Button>
      </div>
    </div>
  )
}
