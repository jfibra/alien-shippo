import type { Metadata } from "next"
import { AddFundsForm } from "@/components/add-funds-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AccountBalance } from "@/components/account-balance"
import { getAccountBalance } from "@/lib/balance-service"
import { getSession } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Add Funds - Viking Freight Dashboard",
  description: "Add funds to your Viking Freight account balance.",
}

export default async function AddFundsPage() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const balance = await getAccountBalance(session.user.id)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
          <CardDescription>Your current account balance available for shipping.</CardDescription>
        </CardHeader>
        <CardContent>
          <AccountBalance balance={balance?.balance || 0} />
        </CardContent>
      </Card>

      <Card className="md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Add Funds</CardTitle>
          <CardDescription>Top up your account using your preferred payment method.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddFundsForm userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
