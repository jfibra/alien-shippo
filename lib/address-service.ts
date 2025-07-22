/**
 * **Client-friendly** address helpers (no server-only imports).
 * All functions currently use mock data so they can run in the browser.
 * Replace with real API requests or server actions when ready.
 */

export type Address = {
  id: string
  user_id: string
  name: string
  company?: string | null
  street1: string
  street2?: string | null
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string | null
  email?: string | null
  is_default?: boolean | null
}

/* ------------------------------ MOCK DATA ------------------------------ */

const mockAddresses: Address[] = [
  {
    id: "addr_1",
    user_id: "demo",
    name: "John Doe",
    company: "Acme Corp",
    street1: "123 Main St",
    street2: "Suite 100",
    city: "New York",
    state: "NY",
    postal_code: "10001",
    country: "US",
    phone: "555-123-4567",
    email: "john@acme.com",
    is_default: true,
  },
]

/* ------------------------------ API-LIKE HELPERS ------------------------------ */

export async function getAllAddresses(_userId: string) {
  return { success: true, addresses: mockAddresses }
}

export async function addAddress(address: Omit<Address, "id">) {
  const newAddr: Address = { ...address, id: `addr_${Date.now()}` }
  mockAddresses.push(newAddr)
  return { success: true, address: newAddr }
}

export async function updateAddress(id: string, updates: Partial<Address>) {
  const idx = mockAddresses.findIndex((a) => a.id === id)
  if (idx === -1) return { success: false, error: "Address not found" }
  mockAddresses[idx] = { ...mockAddresses[idx], ...updates }
  return { success: true, address: mockAddresses[idx] }
}

export async function deleteAddress(id: string) {
  const idx = mockAddresses.findIndex((a) => a.id === id)
  if (idx === -1) return { success: false, error: "Address not found" }
  mockAddresses.splice(idx, 1)
  return { success: true }
}
