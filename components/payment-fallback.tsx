import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export function PaymentFallback() {
  return (
    <Card className="border-red-300 bg-red-50 text-red-800 shadow-md">
      <CardHeader className="flex flex-row items-center space-x-2">
        <AlertCircle className="h-6 w-6" />
        <CardTitle className="text-xl font-semibold text-red-800">Payment Integration Missing</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-red-700">
          Payment functionality is currently disabled or not fully configured.
          <br />
          Please ensure `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `PAYPAL_SECRET_KEY` are set in your environment variables and
          `enablePaypalPayments` is true in `lib/config.ts` for PayPal.
          <br />
          For other payment methods, ensure their respective API keys and feature flags are correctly set.
        </CardDescription>
      </CardContent>
    </Card>
  )
}
