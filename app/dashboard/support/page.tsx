import type { Metadata } from "next"
import { SupportPage } from "./support-page-client"

export const metadata: Metadata = {
  title: "Support | Viking Freight",
  description: "Get help and support for your Viking Freight account and shipments.",
}

export default function SupportPageServer() {
  return <SupportPage />
}
