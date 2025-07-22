"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { createClient } from "@/lib/supabase-browser"
import { useEffect, useState } from "react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
]

interface User {
  id: string
  email: string
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  full_name: string
  role: string
  profile_image_url: string | null
}

export function SiteHeader() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (authUser) {
          // Fetch user profile from users table
          const { data: userProfile } = await supabase
            .from("users")
            .select("*")
            .eq("id", authUser.id)
            .eq("is_deleted", false)
            .single()

          if (userProfile) {
            setUser(userProfile)
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: userProfile } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .eq("is_deleted", false)
          .single()

        if (userProfile) {
          setUser(userProfile)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/alien-shipper-logo.png"
              alt="Alien Shipper Logo"
              width={120}
              height={30}
              className="h-auto w-[120px]"
              priority
            />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              <Image
                src="/alien-shipper-logo.png"
                alt="Alien Shipper Logo"
                width={120}
                height={30}
                className="h-auto w-[120px]"
                priority
              />
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-foreground/60 transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center md:hidden">
              <Image
                src="/alien-shipper-logo.png"
                alt="Alien Shipper Logo"
                width={100}
                height={25}
                className="h-auto w-[100px]"
                priority
              />
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium hidden sm:inline-block">{user.full_name}</span>
                <UserNav user={user} />
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" variant="gold">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
