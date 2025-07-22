import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CreditCard, Plus } from "lucide-react"

interface AccountBalanceProps {
  balance: number
  currency: string
  lastDeposit?: string | null
}

export function AccountBalance({ balance, currency, lastDeposit }: AccountBalanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Account Balance
        </CardTitle>
        <CardDescription>Your current shipping credits.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-4xl font-bold text-navy">
            ${balance.toFixed(2)} <span className="text-lg font-normal text-gray-500">{currency}</span>
          </p>
        </div>
        {lastDeposit && (
          <p className="text-xs text-center text-gray-500">
            Last deposit: {new Date(lastDeposit).toLocaleDateString()}
          </p>
        )}
        <Button asChild className="w-full">
          <Link href="/dashboard/billing/add-funds">
            <Plus className="mr-2 h-4 w-4" /> Add Funds
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
