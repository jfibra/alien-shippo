import type { Metadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AddFundsForm } from "@/components/add-funds-form"
import { TransactionHistory } from "@/components/transaction-history"
import { AccountBalance } from "@/components/account-balance"
import { ShippingCalculator } from "@/components/shipping-calculator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, History, Wallet } from "lucide-react"
import { getSession } from "@/lib/supabase-server"

export const metadata: Metadata = {
  title: "Buy Postage - Viking Freight Dashboard",
  description: "Calculate shipping rates and buy postage for your shipments.",
}

async function getUserBalance(userId: string) {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase
    .from("user_accounts")
    .select("balance, currency, last_deposit_date")
    .eq("user_id", userId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching balance:", error)
  }

  return {
    balance: data?.balance || 0,
    currency: data?.currency || "USD",
    lastDeposit: data?.last_deposit_date || null,
  }
}

async function getTransactionHistory(userId: string) {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching transactions:", error)
    return []
  }

  return data || []
}

export default async function BuyPostagePage() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const userId = session.user.id
  const { balance, currency, lastDeposit } = await getUserBalance(userId)
  const transactions = await getTransactionHistory(userId)

  // Debug log to check the balance value
  console.log("User balance:", { balance, currency, lastDeposit })

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Buy Postage</CardTitle>
          <CardDescription>Calculate rates and purchase shipping labels for your packages.</CardDescription>
        </CardHeader>
        <CardContent>
          <ShippingCalculator />
        </CardContent>
      </Card>

      {/* Balance Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Wallet className="mr-2 h-5 w-5 text-amber-600" />
            Account Balance
          </CardTitle>
          <CardDescription>Your current shipping balance</CardDescription>
        </CardHeader>
        <CardContent>
          <AccountBalance balance={Number(balance)} currency={currency} lastDeposit={lastDeposit} />
        </CardContent>
      </Card>

      {/* Main Content - Add Funds & Transaction History */}
      <div className="md:col-span-2">
        <Tabs defaultValue="add-funds">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add-funds" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Add Funds
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="mr-2 h-4 w-4" />
              Transaction History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add-funds">
            <Card>
              <CardHeader>
                <CardTitle>Add Funds to Your Account</CardTitle>
                <CardDescription>Add funds to your account to purchase shipping labels</CardDescription>
              </CardHeader>
              <CardContent>
                <AddFundsForm currentBalance={Number(balance)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View your recent account activity</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionHistory transactions={transactions} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
