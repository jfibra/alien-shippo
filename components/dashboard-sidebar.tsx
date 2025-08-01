"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Package, CreditCard, MapPin, Activity, HelpCircle, Rocket, LogOut, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/app/actions/auth-server"

interface DashboardSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  className?: string
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Shipments", href: "/dashboard/shipments", icon: Package },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Addresses", href: "/dashboard/addresses", icon: MapPin },
  { name: "Activity", href: "/dashboard/activity", icon: Activity },
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
]

export function DashboardSidebar({ open, setOpen, className }: DashboardSidebarProps) {
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-50 bg-gray-900/80 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "lg:static lg:z-auto",
          className,
        )}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            {/* Primary logo for expanded sidebar */}
            <Image
              src="/alien-shipper-logo.png"
              alt="Alien Shipper"
              width={120}
              height={32}
              className="hidden h-8 w-auto lg:block"
              priority
            />
            {/* Small logo for collapsed / mobile */}
            <Image
              src="/alien-shipper-logo.png"
              alt="Alien Shipper"
              width={32}
              height={32}
              className="h-8 w-8 lg:hidden"
              priority
            />
          </Link>

          {/* Close button for mobile */}
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col px-4 py-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500",
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Bottom actions */}
          <div className="mt-auto space-y-2 border-t border-gray-200 pt-4">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard/ship" className="flex items-center space-x-2">
                <Rocket className="h-4 w-4" />
                <span>Create Shipment</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="w-full border-red-200 bg-transparent text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </nav>
      </div>
    </>
  )
}
