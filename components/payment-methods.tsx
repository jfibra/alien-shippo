"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, CheckCircle, Trash2, Plus } from "lucide-react"
import { ShoppingCartIcon as Paypal, Banknote } from "lucide-react"

interface PaymentMethod {
  id: string
  user_id: string
  type: "card" | "paypal" | "bank_transfer"
  details: {
    last4?: string
    brand?: string
    email?: string
    bank_name?: string
    account_type?: string
  }
  is_default: boolean
  created_at: string
}

interface PaymentMethodsProps {
  initialPaymentMethods: PaymentMethod[]
}

export function PaymentMethods({ initialPaymentMethods }: PaymentMethodsProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
  const { toast } = useToast()

  const handleDeletePaymentMethod = (id: string) => {
    // Simulate API call
    setTimeout(() => {
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id))
      toast({ title: "Payment Method Deleted", description: "Payment method has been removed." })
    }, 500)
  }

  const handleSetDefault = (id: string) => {
    // Simulate API call
    setTimeout(() => {
      setPaymentMethods(
        paymentMethods.map((pm) => ({
          ...pm,
          is_default: pm.id === id,
        })),
      )
      toast({ title: "Default Set", description: "Default payment method updated." })
    }, 500)
  }

  const getPaymentMethodIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5 text-gray-600" />
      case "paypal":
        return <Paypal className="h-5 w-5 text-blue-600" />
      case "bank_transfer":
        return <Banknote className="h-5 w-5 text-green-600" />
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/billing/payment-methods/add">
            <Plus className="mr-2 h-4 w-4" />
            Add New Payment Method
          </Link>
        </Button>
      </div>

      {paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="relative">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getPaymentMethodIcon(method.type)}
                  <div>
                    <p className="font-medium capitalize">
                      {method.type === "card"
                        ? `${method.details.brand} ending in ${method.details.last4}`
                        : method.type === "paypal"
                          ? `PayPal (${method.details.email})`
                          : `Bank Transfer (${method.details.bank_name})`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Added {new Date(method.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.is_default && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Default
                    </span>
                  )}
                  {!method.is_default && (
                    <Button variant="secondary" size="sm" onClick={() => handleSetDefault(method.id)}>
                      Set as Default
                    </Button>
                  )}
                  <Button variant="destructive" size="icon" onClick={() => handleDeletePaymentMethod(method.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>No payment methods added yet.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/billing/payment-methods/add">Add Your First Payment Method</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
