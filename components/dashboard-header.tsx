"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { UserNav } from "@/components/user-nav"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider" // ➊ NEW

export function DashboardHeader() {
  const pathname = usePathname()
  const { user } = useAuth() // ➋ CURRENT USER

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    return segments.map((segment, i) => {
      const href = "/" + segments.slice(0, i + 1).join("/")
      const isLast = i === segments.length - 1
      const name = segment === "dashboard" ? "Dashboard" : segment.charAt(0).toUpperCase() + segment.slice(1)

      return { name, href, isLast }
    })
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.href} className="flex items-center">
                {idx > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem className={idx === 0 ? "hidden md:block" : ""}>
                  {crumb.isLast ? (
                    <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>{crumb.name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* right side */}
      <div className="ml-auto px-3">
        {user && <UserNav user={user} />} {/* ➌ SAFE RENDER */}
      </div>
    </header>
  )
}
