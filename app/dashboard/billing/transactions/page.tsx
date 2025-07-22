import type { Metadata } from "next"
import { TransactionHistory } from "@/components/transaction-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download } from "lucide-react"

export const metadata: Metadata = {
  title: "Transactions - Viking Freight Dashboard",
  description: "View your transaction history and export data.",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function TransactionsPage() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Transaction History</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/api/export-transactions">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">A detailed record of all your account transactions.</CardDescription>
          <TransactionHistory userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
