import type React from "react"
import Image from "next/image"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/alien-shipper-logo.png" // Ensure this path is correct
            alt="AlienShipper Logo"
            width={200}
            height={50}
            className="h-auto w-[150px] sm:w-[200px]"
            priority
          />
        </Link>
      </div>
      {children}
    </div>
  )
}
