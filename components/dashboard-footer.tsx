import Link from "next/link"

export function DashboardFooter() {
  return (
    <footer className="border-t bg-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-2 text-sm text-gray-600 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-4">
            <p>&copy; 2024 AlienShippo. All rights reserved.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/privacy-policy" className="hover:text-navy transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="hover:text-navy transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-navy transition-colors">
              Contact Mission Control
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
