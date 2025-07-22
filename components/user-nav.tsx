"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, CreditCard, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/app/actions/auth-server"
import { useTransition } from "react"

interface UserNavProps {
  user: {
    id: string
    email: string
    first_name: string | null
    middle_name: string | null
    last_name: string | null
    full_name: string
    role: string
    profile_image_url: string | null
  }
}

export function UserNav({ user }: UserNavProps) {
  const [isPending, startTransition] = useTransition()

  // ─────────────────────────────────────────────────────────────
  // Ensure we always have a safe string to work with.
  const fullName = user.full_name ?? user.email ?? "User"

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .toUpperCase()

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await signOut()
      } catch (error) {
        console.error("Error signing out:", error)
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profile_image_url || ""} alt={fullName} />
            <AvatarFallback className="bg-blue-600 text-white">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/billing" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/support" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Support</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
          onClick={handleSignOut}
          disabled={isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isPending ? "Signing out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
