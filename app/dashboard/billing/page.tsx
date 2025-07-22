import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Download, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillingPageClient } from "./billing-page-client"
import { PaymentMethods } from "@/components/payment-methods"
import { AddFundsForm } from "@/components/add-funds-form"

// Mock data for billing page
const mockTransactions = [
  {
    id: "txn_1",
    user_id: "mock_user_1",
    transaction_type: "deposit" as "deposit" | "debit",
    amount: 100.0,
    currency: "USD",
    created_at: "2024-07-20T10:00:00Z",
    provider: "PayPal",
    shipments: null,
  },
  {
    id: "txn_2",
    user_id: "mock_user_1",
    transaction_type: "debit" as "deposit" | "debit",
    amount: 15.5,
    currency: "USD",
    created_at: "2024-07-19T14:30:00Z",
    provider: "EasyPost",
    shipments: {
      id: "ship_1",
      tracking_number: "TRK123456789",
      status: "in_transit",
      carrier: "USPS",
    },
  },
  {
    id: "txn_3",
    user_id: "mock_user_1",
    transaction_type: "deposit" as "deposit" | "debit",
    amount: 50.0,
    currency: "USD",
    created_at: "2024-07-18T09:15:00Z",
    provider: "Stripe",
    shipments: null,
  },
]

const mockPaymentMethods = [
  {
    id: "pm_1",
    user_id: "mock_user_1",
    type: "card" as "card" | "paypal" | "bank_transfer",
    details: { last4: "4242", brand: "Visa" },
    is_default: true,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "pm_2",
    user_id: "mock_user_1",
    type: "paypal" as "card" | "paypal" | "bank_transfer",
    details: { email: "demo@vikingfreight.com" },
    is_default: false,
    created_at: "2023-02-01T00:00:00Z",
  },
]

const mockAccountData = {
  balance: 80.5,
  currency: "USD",
  last_deposit_date: "2024-07-20T10:00:00Z",
}

const mockBillingInfo = {
  company_name: "Demo Company Inc.",
  tax_id: "12-3456789",
}

export default function BillingPage() {
  const totalSpent = mockTransactions.reduce((sum, t) => (t.transaction_type === "debit" ? sum + t.amount : sum), 0)
  const totalDeposited = mockTransactions.reduce(
    (sum, t) => (t.transaction_type === "deposit" ? sum + t.amount : sum),
    0,
  )
  const transactionCount = mockTransactions.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Billing & Payments</h1>
          <p className="text-muted-foreground">Manage your account balance, payment methods, and billing information</p>
        </div>
        <Button asChild variant="gold">
          <Link href="/dashboard/billing/add-funds">
            <Plus className="mr-2 h-4 w-4" />
            Add Funds
          </Link>
        </Button>
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">💰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${mockAccountData.balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Available for shipping</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📈</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDeposited.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime deposits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">On shipping labels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🧾</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionCount}</div>
            <p className="text-xs text-muted-foreground">Total transactions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="billing-info">Billing Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest account activity</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="#transactions">
                      <Eye className="mr-2 h-4 w-4" />
                      View All
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.transaction_type === "deposit"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {transaction.transaction_type === "deposit" ? "💰" : "📦"}
                          </div>
                          <div>
                            <p className="font-medium">
                              {transaction.transaction_type === "deposit" ? "Funds Added" : "Label Purchase"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              transaction.transaction_type === "deposit" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.transaction_type === "deposit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </p>
                          {transaction.provider && (
                            <p className="text-xs text-muted-foreground">{transaction.provider}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Add Funds Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Funds</CardTitle>
                  <CardDescription>Top up your shipping balance</CardDescription>
                </CardHeader>
                <CardContent>
                  <AddFundsForm />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/dashboard/billing/payment-methods/add">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/dashboard/addresses?tab=billing">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Billing Address
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Export Transactions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <BillingPageClient initialTransactions={mockTransactions} userId="mock_user_1" />
        </TabsContent>

        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethods initialPaymentMethods={mockPaymentMethods} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing-info">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Update your billing details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name (Optional)</Label>
                  <Input
                    id="company-name"
                    defaultValue={mockBillingInfo.company_name}
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <Label htmlFor="tax-id">Tax ID (Optional)</Label>
                  <Input id="tax-id" placeholder="e.g., EIN or VAT number" defaultValue={mockBillingInfo.tax_id} />
                </div>

                <div>
                  <Label>Email Receipts To</Label>
                  <Input defaultValue="demo@vikingfreight.com" />
                </div>

                <Button className="w-full">Save Billing Information</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>Select your default billing address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No billing addresses found</p>
                  <Button asChild>
                    <Link href="/dashboard/addresses?tab=billing">Add Billing Address</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
