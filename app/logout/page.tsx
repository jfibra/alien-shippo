"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "@/app/actions/auth-server" // Assuming this is your server action for sign out
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      await signOut()
      // The signOut server action will handle the redirect to /login
    }
    performLogout()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Logging Out</CardTitle>
          <CardDescription>Please wait while we securely log you out.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-gray-600">You will be redirected shortly...</p>
        </CardContent>
      </Card>
    </div>
  )
}
