"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, XCircle } from "lucide-react"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { AccountBalance } from "@/components/account-balance"
import { AuthRedirect } from "@/components/auth-redirect"
import { EnvDebugComponent } from "@/lib/env-check"
import { SiteAudit } from "@/components/site-audit"
import { EnvVariablesAudit } from "@/components/env-variables-audit"
import { MockDataDetector } from "@/components/mock-data-detector"

export default function DashboardPageClient() {
  const router = useRouter()
  const { balance, recentShipments, recentActivity, isLoading, error, refetch } = useDashboardData()

  return (
    <div className="flex flex-col gap-6">
      <AuthRedirect requireAuth />
      <EnvDebugComponent />
      <MockDataDetector />
      <SiteAudit />
      <EnvVariablesAudit />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
            <CardDescription>Your current account balance available for shipping.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </div>
            ) : error ? (
              <div className="flex items-center text-red-600">
                <XCircle className="mr-2 h-5 w-5" />
                {error}
              </div>
            ) : (
              <AccountBalance balance={balance?.balance || 0} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between\
