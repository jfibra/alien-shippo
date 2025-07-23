import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { RecentShipments } from "@/components/recent-shipments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TransactionHistory } from "@/components/transaction-history"
import { AccountBalance } from "@/components/account-balance"
import { Package, TrendingUp, Activity, CreditCard, MapPin, Plus, Rocket } from "lucide-react"
import { getAccountBalance } from "@/lib/balance-service"
import { getTransactions } from "@/lib/transaction-service"
import { getShipments } from "@/lib/shipment-service"

function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
    },
  })
}

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch real data from Supabase
  const [balanceData, { transactions }, { shipments }] = await Promise.all([
    getAccountBalance(user.id),
    getTransactions(user.id, 1, 5),
    getShipments(user.id, 1, 5),
  ])

  // Calculate metrics from real data
  const metrics = {
    total_shipments: shipments.length,
    delivered_shipments: shipments.filter((s) => s.status === "delivered").length,
    in_transit_shipments: shipments.filter((s) => s.status === "in_transit").length,
    created_shipments: shipments.filter((s) => s.status === "created").length,
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back! 🚀</h1>
            <p className="text-blue-100">Your shipping command center is ready for action.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/dashboard/ship" className="flex items-center space-x-2">
                <Rocket className="h-5 w-5" />
                <span>Create Shipment</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <DashboardMetrics metrics={metrics} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shipments - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl">Recent Shipments</CardTitle>
                <CardDescription>Your latest deliveries</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/shipments" className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>View All</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <RecentShipments shipments={shipments} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Account Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Account Balance</span>
              </CardTitle>
              <CardDescription>Your current shipping credits</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountBalance
                balance={balanceData?.balance ?? 0}
                currency={balanceData?.currency ?? "USD"}
                lastDeposit={balanceData?.last_deposit_date}
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/dashboard/ship">
                  <Package className="mr-2 h-4 w-4" />
                  Create New Shipment
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/dashboard/billing/add-funds">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Funds
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/dashboard/addresses">
                  <MapPin className="mr-2 h-4 w-4" />
                  Manage Addresses
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/dashboard/activity">
                  <Activity className="mr-2 h-4 w-4" />
                  View Activity
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">Recent Transactions</CardTitle>
            <CardDescription>Your latest account activity</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/billing" className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span>View All</span>
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <TransactionHistory transactions={transactions} />
        </CardContent>
      </Card>
    </div>
  )
}
