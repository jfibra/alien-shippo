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
import { Package, TrendingUp, Activity, CreditCard, MapPin, Plus, Rocket, Bell } from "lucide-react"

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

  // Fetch real data from database
  const [{ data: userAccount }, { data: recentShipments }, { data: recentTransactions }, { data: notifications }] =
    await Promise.all([
      supabase.from("user_accounts").select("*").eq("user_id", user.id).single(),
      supabase
        .from("shipments")
        .select(`
        *,
        from_address:addresses!shipments_from_address_id_fkey(name, city, state),
        to_address:addresses!shipments_to_address_id_fkey(name, city, state)
      `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(5),
    ])

  // Calculate metrics from real data
  const totalShipments = recentShipments?.length || 0
  const deliveredShipments = recentShipments?.filter((s) => s.status === "delivered").length || 0
  const inTransitShipments = recentShipments?.filter((s) => s.status === "in_transit").length || 0
  const createdShipments = recentShipments?.filter((s) => s.status === "created").length || 0

  const metrics = {
    total_shipments: totalShipments,
    delivered_shipments: deliveredShipments,
    in_transit_shipments: inTransitShipments,
    created_shipments: createdShipments,
  }

  return (
    <div className="w-full space-y-6">
      {/* Welcome Header - Full Width */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 md:p-6 text-white">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Welcome back! 🚀</h1>
            <p className="text-blue-100 text-sm md:text-base">Your shipping command center is ready for action.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/dashboard/ship" className="flex items-center space-x-2">
                <Rocket className="h-4 w-4" />
                <span>Create Shipment</span>
              </Link>
            </Button>
            {notifications && notifications.length > 0 && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/dashboard/notifications" className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                  <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">{notifications.length}</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Cards - Full Width */}
      <DashboardMetrics metrics={metrics} />

      {/* Main Content Grid - Full Width Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Recent Shipments - Takes up 3 columns on xl screens */}
        <div className="xl:col-span-3 space-y-6">
          <Card className="h-full">
            <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg md:text-xl">Recent Shipments</CardTitle>
                <CardDescription className="text-sm">Your latest deliveries</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/shipments" className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>View All</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <RecentShipments shipments={recentShipments || []} />
            </CardContent>
          </Card>

          {/* Recent Transactions - Mobile: Full width, Desktop: 3 columns */}
          <Card className="xl:hidden">
            <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription className="text-sm">Your latest account activity</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/billing" className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>View All</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <TransactionHistory transactions={recentTransactions || []} userId={user.id} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content - 1 column on xl screens */}
        <div className="xl:col-span-1 space-y-6">
          {/* Account Balance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg flex items-center space-x-2">
                <CreditCard className="h-4 w-4 md:h-5 md:w-5" />
                <span>Balance</span>
              </CardTitle>
              <CardDescription className="text-sm">Current credits</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountBalance
                balance={userAccount?.balance || 0}
                currency={userAccount?.currency || "USD"}
                lastDeposit={userAccount?.last_deposit_date}
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
              <CardDescription className="text-sm">Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                <Button asChild className="w-full justify-start bg-transparent" variant="outline" size="sm">
                  <Link href="/dashboard/ship">
                    <Package className="mr-2 h-4 w-4" />
                    <span className="truncate">Create Shipment</span>
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline" size="sm">
                  <Link href="/dashboard/billing/add-funds">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="truncate">Add Funds</span>
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline" size="sm">
                  <Link href="/dashboard/addresses">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="truncate">Addresses</span>
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline" size="sm">
                  <Link href="/dashboard/activity">
                    <Activity className="mr-2 h-4 w-4" />
                    <span className="truncate">Activity</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          {notifications && notifications.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium truncate">{notification.title}</p>
                      <p className="text-xs text-gray-600 truncate">{notification.message}</p>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                    <Link href="/dashboard/notifications">View All</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Transactions - Desktop xl+ only, full width */}
      <Card className="hidden xl:block">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
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
          <TransactionHistory transactions={recentTransactions || []} userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
