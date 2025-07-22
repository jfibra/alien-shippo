import { DashboardMetrics } from "@/components/dashboard-metrics"
import { RecentShipments } from "@/components/recent-shipments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TransactionHistory } from "@/components/transaction-history"
import { AccountBalance } from "@/components/account-balance"
import { Package, TrendingUp, Activity, CreditCard, MapPin, Plus, Rocket } from "lucide-react"

// Mock data for dashboard
const mockMetrics = {
  total_shipments: 125,
  delivered_shipments: 90,
  in_transit_shipments: 25,
  created_shipments: 10,
}

const mockRecentShipments = [
  {
    id: "ship_1",
    user_id: "mock_user_1",
    tracking_number: "AS123456789",
    carrier: "USPS",
    service: "Priority Mail",
    status: "delivered",
    from_address_id: "addr_from_1",
    to_address_id: "addr_to_1",
    package_details: { weight: 5, type: "parcel" },
    cost: 15.5,
    currency: "USD",
    created_at: "2024-07-19T14:30:00Z",
    updated_at: "2024-07-21T10:00:00Z",
    estimated_delivery: "2024-07-21T00:00:00Z",
    actual_delivery: "2024-07-21T10:00:00Z",
    label_url: "#",
    tracking_url: "#",
    to_address: { name: "Alice Smith", city: "New York", state: "NY" },
  },
  {
    id: "ship_2",
    user_id: "mock_user_1",
    tracking_number: "AS987654321",
    carrier: "UPS",
    service: "Ground",
    status: "in_transit",
    from_address_id: "addr_from_1",
    to_address_id: "addr_to_2",
    package_details: { weight: 10, type: "parcel" },
    cost: 22.75,
    currency: "USD",
    created_at: "2024-07-17T11:00:00Z",
    updated_at: "2024-07-20T08:00:00Z",
    estimated_delivery: "2024-07-23T00:00:00Z",
    actual_delivery: null,
    label_url: "#",
    tracking_url: "#",
    to_address: { name: "Bob Johnson", city: "Los Angeles", state: "CA" },
  },
  {
    id: "ship_3",
    user_id: "mock_user_1",
    tracking_number: "AS112233445",
    carrier: "FedEx",
    service: "Express Saver",
    status: "created",
    from_address_id: "addr_from_2",
    to_address_id: "addr_to_3",
    package_details: { weight: 2, type: "letter" },
    cost: 5.2,
    currency: "USD",
    created_at: "2024-07-16T16:00:00Z",
    updated_at: "2024-07-16T16:00:00Z",
    estimated_delivery: "2024-07-22T00:00:00Z",
    actual_delivery: null,
    label_url: "#",
    tracking_url: "#",
    to_address: { name: "Charlie Brown", city: "Chicago", state: "IL" },
  },
]

const mockRecentTransactions = [
  {
    id: "txn_1",
    user_id: "mock_user_1",
    transaction_type: "deposit",
    amount: 100.0,
    currency: "USD",
    created_at: "2024-07-20T10:00:00Z",
  },
  {
    id: "txn_2",
    user_id: "mock_user_1",
    transaction_type: "debit",
    amount: 15.5,
    currency: "USD",
    created_at: "2024-07-19T14:30:00Z",
  },
  {
    id: "txn_3",
    user_id: "mock_user_1",
    transaction_type: "deposit",
    amount: 50.0,
    currency: "USD",
    created_at: "2024-07-18T09:15:00Z",
  },
]

const mockAccountData = {
  balance: 134.5,
  currency: "USD",
  last_deposit_date: "2024-07-20T10:00:00Z",
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Space Commander! 🚀</h1>
            <p className="text-blue-100">Your intergalactic shipping command center is ready for action.</p>
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
      <DashboardMetrics metrics={mockMetrics} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shipments - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl">Recent Shipments</CardTitle>
                <CardDescription>Your latest intergalactic deliveries</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/shipments" className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>View All</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <RecentShipments shipments={mockRecentShipments} />
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
                balance={mockAccountData.balance}
                currency={mockAccountData.currency}
                lastDeposit={mockAccountData.last_deposit_date}
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
          <TransactionHistory transactions={mockRecentTransactions} />
        </CardContent>
      </Card>
    </div>
  )
}
