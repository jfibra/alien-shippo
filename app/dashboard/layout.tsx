"use client"

import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useState } from "react"
import { AuthProvider } from "@/components/auth-provider"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={false}>
        <div className="min-h-screen bg-gray-50">
          {/* Mobile sidebar */}
          <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} className="lg:hidden" />

          {/* Desktop sidebar */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
            <DashboardSidebar open={true} setOpen={() => {}} className="lg:block" />
          </div>

          {/* Main content */}
          <div className="lg:pl-64">
            <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
            <main className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  )
}
