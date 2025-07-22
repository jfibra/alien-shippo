import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Download } from "lucide-react"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAccountBalance } from "@/lib/balance-service"
import { getTransactions } from "@/lib/transaction-service"
import { TransactionHistory } from "@/components/transaction-history"
import { AccountBalance } from "@/components/account-balance"

// Helper to get Supabase client for server components
function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
    },
  })
}

export const dynamic = "force-dynamic"

export default async function BillingPage() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const balanceData = await getAccountBalance(user.id)
  const { transactions, totalCount } = await getTransactions(user.id, 1, 10)

  const totalSpent = transactions.reduce((sum, t) => (t.transaction_type === "debit" ? sum + t.amount : sum), 0)
  const totalDeposited = transactions.reduce((sum, t) => (t.transaction_type === "deposit" ? sum + t.amount : sum), 0)
  const transactionCount = totalCount

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Billing & Payments</h1>
          <p className="text-gray-600 mt-2">Manage your balance, payment methods, and view transaction history.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/billing/add-funds">
            <Plus className="mr-2 h-4 w-4" /> Add Funds
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AccountBalance
            balance={balanceData?.balance ?? 0}
            currency={balanceData?.currency ?? "USD"}
            lastDeposit={balanceData?.last_deposit_date}
          />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Your saved payment methods.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* PaymentMethods component would go here */}
              <p className="text-sm text-gray-500">No payment methods saved.</p>
              <Button variant="outline" className="mt-4 bg-transparent" asChild>
                <Link href="/dashboard/billing/payment-methods/add">Add Payment Method</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>A detailed record of all your account transactions.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/api/export-transactions">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <TransactionHistory initialTransactions={transactions} totalCount={totalCount} userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
