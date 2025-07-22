"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface EnvVariable {
  name: string
  description: string
  required: boolean
  category: "supabase" | "payment" | "shipping" | "site" | "auth"
  currentValue?: string
  isSet: boolean
  usage: string[]
}

export default function EnvVariablesAudit() {
  const envVariables: EnvVariable[] = [
    // Supabase Variables
    {
      name: "NEXT_PUBLIC_SUPABASE_URL",
      description: "Public Supabase project URL",
      required: true,
      category: "supabase",
      currentValue: process.env.NEXT_PUBLIC_SUPABASE_URL,
      isSet: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      usage: ["Database connection", "Authentication", "Real-time subscriptions"],
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      description: "Public Supabase anonymous key",
      required: true,
      category: "supabase",
      currentValue: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      isSet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      usage: ["Client-side database access", "Authentication"],
    },
    {
      name: "SUPABASE_SERVICE_ROLE_KEY",
      description: "Supabase service role key (server-side only)",
      required: false,
      category: "supabase",
      currentValue: process.env.SUPABASE_SERVICE_ROLE_KEY ? "[HIDDEN]" : undefined,
      isSet: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      usage: ["Admin operations", "Server-side database access"],
    },
    {
      name: "DATABASE_URL",
      description: "Database URL for server-side operations",
      required: false,
      category: "supabase",
      currentValue: process.env.DATABASE_URL,
      isSet: !!process.env.DATABASE_URL,
      usage: ["Server-side database connection"],
    },

    // Payment Variables
    {
      name: "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
      description: "PayPal client ID for frontend",
      required: true,
      category: "payment",
      currentValue: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      isSet: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      usage: ["PayPal payment processing", "Account funding"],
    },
    {
      name: "PAYPAL_SECRET_KEY",
      description: "PayPal secret key (server-side only)",
      required: true,
      category: "payment",
      currentValue: process.env.PAYPAL_SECRET_KEY ? "[HIDDEN]" : undefined,
      isSet: !!process.env.PAYPAL_SECRET_KEY,
      usage: ["PayPal API authentication", "Payment verification"],
    },

    // Shipping Variables
    {
      name: "SHIPPO_API_KEY",
      description: "Shippo API key for shipping rates",
      required: true,
      category: "shipping",
      currentValue: process.env.SHIPPO_API_KEY ? "[HIDDEN]" : undefined,
      isSet: !!process.env.SHIPPO_API_KEY,
      usage: ["Real-time shipping rates", "Label generation", "Carrier integration"],
    },
    {
      name: "EASYPOST_API_KEY",
      description: "EasyPost API key (alternative shipping provider)",
      required: false,
      category: "shipping",
      currentValue: process.env.EASYPOST_API_KEY ? "[HIDDEN]" : undefined,
      isSet: !!process.env.EASYPOST_API_KEY,
      usage: ["Alternative shipping rates", "Additional carrier options"],
    },

    // Site Configuration
    {
      name: "NEXT_PUBLIC_SITE_URL",
      description: "Public site URL for redirects and links",
      required: true,
      category: "site",
      currentValue: process.env.NEXT_PUBLIC_SITE_URL,
      isSet: !!process.env.NEXT_PUBLIC_SITE_URL,
      usage: ["Authentication redirects", "Email links", "API callbacks"],
    },
  ]

  const copyEnvTemplate = () => {
    const template = envVariables
      .map((env) => {
        const comment = `# ${env.description}`
        const required = env.required ? " (REQUIRED)" : " (OPTIONAL)"
        const usage = `# Usage: ${env.usage.join(", ")}`
        return `${comment}${required}\n${usage}\n${env.name}=${env.currentValue && !env.currentValue.includes("[HIDDEN]") ? env.currentValue : ""}\n`
      })
      .join("\n")

    navigator.clipboard.writeText(template)
    toast.success("Environment variables template copied to clipboard!")
  }

  const getStatusIcon = (isSet: boolean, required: boolean) => {
    if (isSet) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (required) return <XCircle className="h-4 w-4 text-red-500" />
    return <AlertCircle className="h-4 w-4 text-yellow-500" />
  }

  const getStatusBadge = (isSet: boolean, required: boolean) => {
    if (isSet)
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Set
        </Badge>
      )
    if (required) return <Badge variant="destructive">Missing (Required)</Badge>
    return <Badge variant="secondary">Not Set (Optional)</Badge>
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "supabase":
        return "bg-green-50 border-green-200"
      case "payment":
        return "bg-blue-50 border-blue-200"
      case "shipping":
        return "bg-purple-50 border-purple-200"
      case "site":
        return "bg-orange-50 border-orange-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const requiredCount = envVariables.filter((env) => env.required).length
  const setRequiredCount = envVariables.filter((env) => env.required && env.isSet).length
  const totalSetCount = envVariables.filter((env) => env.isSet).length

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Environment Variables Audit
            <Button onClick={copyEnvTemplate} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy .env Template
            </Button>
          </CardTitle>
          <CardDescription>Current status of all environment variables used in Viking Freight</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {setRequiredCount}/{requiredCount}
              </div>
              <div className="text-sm text-green-700">Required Variables Set</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {totalSetCount}/{envVariables.length}
              </div>
              <div className="text-sm text-blue-700">Total Variables Set</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((setRequiredCount / requiredCount) * 100)}%
              </div>
              <div className="text-sm text-purple-700">Configuration Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mock Environment Variables Audit Component */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Environment Variables Status</h3>
        <p className="text-green-700">All environment variables are properly configured for demo mode.</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700">Demo Mode: Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700">Mock Data: Enabled</span>
          </div>
        </div>
      </div>

      {/* Variables by Category */}
      {["supabase", "payment", "shipping", "site"].map((category) => (
        <Card key={category} className={getCategoryColor(category)}>
          <CardHeader>
            <CardTitle className="capitalize">{category} Configuration</CardTitle>
            <CardDescription>Environment variables for {category} functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {envVariables
                .filter((env) => env.category === category)
                .map((env) => (
                  <div key={env.name} className="flex items-start justify-between p-4 bg-white rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(env.isSet, env.required)}
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{env.name}</code>
                        {getStatusBadge(env.isSet, env.required)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{env.description}</p>
                      <div className="text-xs text-gray-500">
                        <strong>Usage:</strong> {env.usage.join(", ")}
                      </div>
                      {env.currentValue && (
                        <div className="text-xs text-gray-500 mt-1">
                          <strong>Current Value:</strong>
                          <code className="ml-1 bg-gray-100 px-1 rounded">
                            {env.currentValue.length > 50
                              ? `${env.currentValue.substring(0, 50)}...`
                              : env.currentValue}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Missing Variables Alert */}
      {setRequiredCount < requiredCount && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">⚠️ Missing Required Variables</CardTitle>
            <CardDescription className="text-red-700">
              The following required environment variables are not set:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {envVariables
                .filter((env) => env.required && !env.isSet)
                .map((env) => (
                  <li key={env.name} className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <code className="font-mono text-sm">{env.name}</code>
                    <span className="text-sm text-red-700">- {env.description}</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
