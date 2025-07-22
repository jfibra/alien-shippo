import type { Metadata } from "next"
import { AddPaymentMethodForm } from "@/components/add-payment-method-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Add Payment Method - Viking Freight Dashboard",
  description: "Add a new payment method to your Viking Freight account.",
}

export default async function AddPaymentMethodPage() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Add New Payment Method</CardTitle>
          <CardDescription>Securely add a credit card or other payment option to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddPaymentMethodForm userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
