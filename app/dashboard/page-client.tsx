"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, XCircle, RefreshCcw } from "lucide-react"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { AccountBalance } from "@/components/account-balance"
import { AuthRedirect } from "@/components/auth-redirect"
import { SiteAudit } from "@/components/site-audit"
import { EnvVariablesAudit } from "@/components/env-variables-audit"
import { MockDataDetector } from "@/components/mock-data-detector"
import { RecentShipments } from "@/components/recent-shipments"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { cn } from "@/lib/utils"

export default function DashboardPageClient() {
  /**
   * Redirect unauthenticated users (handled inside <AuthRedirect />)
   * If auth state changes, we refresh the dashboard data.
   */
  const router = useRouter()
  const { balance, recentShipments, recentActivity, isLoading, error, refetch } = useDashboardData()

  // Optional: refresh dashboard data on focus
  useEffect(() => {
    const handleFocus = () => {
      refetch().catch(console.error)
    }
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [refetch])

  return (
    <div className="flex flex-col gap-6">
      {/* Check session & env audit helpers */}
      <AuthRedirect requireAuth />
      <SiteAudit />
      <EnvVariablesAudit />
      <MockDataDetector />

      {/* Metrics Row */}
      <DashboardMetrics />

      {/* Balance + Recent Shipments */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Account Balance */}
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
              <ErrorState message={error} onRetry={refetch} />
            ) : (
              <AccountBalance balance={balance?.balance ?? 0} />
            )}
          </CardContent>
        </Card>

        {/* Recent Shipments */}
        <Card className={cn("md:col-span-1 lg:col-span-2")}>
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
            <CardDescription>Your most recent labels and tracking events.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && !recentShipments ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={refetch} />
            ) : recentShipments?.length ? (
              <RecentShipments shipments={recentShipments.slice(0, 5)} />
            ) : (
              <p className="text-sm text-muted-foreground">No shipments yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions performed in your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && !recentActivity ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : recentActivity?.length ? (
            <ul className="space-y-2 text-sm">
              {recentActivity.slice(0, 10).map((act) => (
                <li key={act.id} className="flex flex-col">
                  <span className="font-medium">{act.description}</span>
                  <span className="text-muted-foreground text-xs">{act.created_at}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Reusable error state component to show an error message + retry button
 */
function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void | Promise<void>
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-destructive">
      <div className="flex items-center">
        <XCircle className="mr-2 h-5 w-5" />
        <span className="text-sm">{message}</span>
      </div>
      <Button onClick={() => onRetry()} variant="outline" size="sm" className="flex items-center gap-1">
        <RefreshCcw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  )
}
