import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mb-4 text-3xl font-semibold text-gray-700">Page Not Found</h2>
      <p className="mb-8 text-lg text-gray-600">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Button asChild className="bg-gold text-white hover:bg-gold/90">
        <Link href="/">Go to Homepage</Link>
      </Button>
    </div>
  )
}
