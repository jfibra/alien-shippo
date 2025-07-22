"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { toast } from "sonner"

export default function EnvTemplateGenerator() {
  const envTemplate = `# Viking Freight Environment Variables
# Copy this template to your .env.local file and fill in the values

# =============================================================================
# SUPABASE CONFIGURATION (REQUIRED)
# =============================================================================

# Your Supabase project URL (found in Supabase dashboard > Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Your Supabase anon/public key (found in Supabase dashboard > Settings > API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Your Supabase service role key (optional, for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# =============================================================================
# PAYPAL CONFIGURATION (REQUIRED)
# =============================================================================

# PayPal Client ID (from PayPal Developer Dashboard)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id

# PayPal Secret Key (from PayPal Developer Dashboard)
PAYPAL_SECRET_KEY=your-paypal-secret-key

# =============================================================================
# SHIPPING CONFIGURATION (REQUIRED)
# =============================================================================

# Shippo API Key (from Shippo dashboard > API)
SHIPPO_API_KEY=your-shippo-api-key

# EasyPost API Key (optional, alternative shipping provider)
EASYPOST_API_KEY=your-easypost-api-key

# =============================================================================
# SITE CONFIGURATION (REQUIRED)
# =============================================================================

# Your site URL (for redirects and callbacks)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# =============================================================================
# DEVELOPMENT NOTES
# =============================================================================

# For development:
# - Use Shippo test API keys
# - Use PayPal sandbox credentials
# - Set NEXT_PUBLIC_SITE_URL to http://localhost:3000

# For production:
# - Use live API keys for all services
# - Set NEXT_PUBLIC_SITE_URL to your actual domain
# - Ensure all required variables are set in your hosting platform
`

  const copyTemplate = () => {
    navigator.clipboard.writeText(envTemplate)
    toast.success("Environment template copied to clipboard!")
  }

  const downloadTemplate = () => {
    const blob = new Blob([envTemplate], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = ".env.local.template"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Environment template downloaded!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables Template</CardTitle>
        <CardDescription>Copy this template to set up your environment variables</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={copyTemplate} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy Template
            </Button>
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download .env Template
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{envTemplate}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
