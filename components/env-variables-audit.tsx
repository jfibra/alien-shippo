import "server-only" // 🚫 runs only on the server

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

type Category = "supabase" | "payment" | "shipping" | "site"

/* ---------- Helpers ---------- */

interface EnvVariable {
  name: string
  description: string
  required: boolean
  category: Category
  isSet: boolean
}

const envVars: EnvVariable[] = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    description: "Public Supabase project URL",
    required: true,
    category: "supabase",
    isSet: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    description: "Public Supabase anonymous key",
    required: true,
    category: "supabase",
    isSet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    description: "Supabase service role key",
    required: false,
    category: "supabase",
    isSet: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  {
    name: "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
    description: "PayPal client ID",
    required: true,
    category: "payment",
    isSet: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  },
  // NOTE: server-only vars like SHIPPO_API_KEY are intentionally excluded
]

const icon = (v: EnvVariable) =>
  v.isSet ? (
    <CheckCircle className="h-4 w-4 text-green-500" />
  ) : v.required ? (
    <XCircle className="h-4 w-4 text-red-500" />
  ) : (
    <AlertCircle className="h-4 w-4 text-yellow-500" />
  )

const badge = (v: EnvVariable) =>
  v.isSet ? (
    <Badge className="bg-green-100 text-green-800">Set</Badge>
  ) : v.required ? (
    <Badge variant="destructive">Missing</Badge>
  ) : (
    <Badge variant="secondary">Optional</Badge>
  )

/* ---------- Component ---------- */

export default function EnvVariablesAudit() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables Audit</CardTitle>
        <CardDescription>Only PUBLIC environment variables are checked in&nbsp;the browser.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {envVars.map((v) => (
          <div key={v.name} className="flex items-center justify-between rounded-lg border px-3 py-2">
            <div className="flex items-center gap-2">
              {icon(v)}
              <code className="font-mono text-sm">{v.name}</code>
            </div>
            {badge(v)}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// also export as named export for consumers expecting it
export { EnvVariablesAudit }
