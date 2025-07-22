import type { Metadata } from "next"
import SupportPageClient from "./SupportPageClient"

export const metadata: Metadata = {
  title: "Support | Viking Freight",
  description: "Get help and support for your Viking Freight shipping needs.",
}

export default function SupportPage() {
  return <SupportPageClient />
}
