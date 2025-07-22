import type { Metadata } from "next"
import AddressBookPageClient from "./AddressBookPageClient"

export const metadata: Metadata = {
  title: "Address Book | Viking Freight",
  description: "Manage your shipping and return addresses",
}

// Mock data for addresses
const mockAddresses = [
  {
    id: "addr_1",
    user_id: "mock_user_1",
    name: "Home Address",
    recipient: "Demo User",
    address1: "123 Main St",
    address2: null,
    city: "Anytown",
    state: "CA",
    postal_code: "90210",
    country: "USA",
    phone: "555-123-4567",
    email: "demo@vikingfreight.com",
    address_type: "shipping",
    type: "residential",
    is_default: true,
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "addr_2",
    user_id: "mock_user_1",
    name: "Work Address",
    recipient: "Jane Smith",
    company: "Demo Corp",
    address1: "456 Business Ave",
    address2: "Suite 100",
    city: "Big City",
    state: "NY",
    postal_code: "10001",
    country: "USA",
    phone: "555-987-6543",
    email: "jane.smith@democorp.com",
    address_type: "return",
    type: "commercial",
    is_default: true,
    created_at: "2024-01-05T11:00:00Z",
  },
  {
    id: "addr_3",
    user_id: "mock_user_1",
    name: "Billing Address",
    recipient: "Demo User",
    address1: "789 Billing Rd",
    address2: null,
    city: "Financeville",
    state: "TX",
    postal_code: "75001",
    country: "USA",
    phone: "555-111-2222",
    email: "demo@vikingfreight.com",
    address_type: "billing",
    type: "residential",
    is_default: true,
    created_at: "2024-02-10T14:00:00Z",
  },
]

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Address Book</h1>
        <p className="text-muted-foreground">Manage your shipping and return addresses for faster checkout.</p>
      </div>
      <AddressBookPageClient initialAddresses={mockAddresses} />
    </div>
  )
}
