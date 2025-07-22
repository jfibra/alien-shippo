"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "@/app/actions/auth-server"

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  )
}
