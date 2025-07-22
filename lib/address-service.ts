// Mock address service for dashboard demo
export async function getAllAddresses(userId: string) {
  // Return mock address data
  return {
    success: true,
    data: [
      {
        id: "addr_1",
        user_id: userId,
        name: "John Doe",
        company: "Acme Corp",
        street1: "123 Main St",
        street2: "Suite 100",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "US",
        phone: "555-123-4567",
        email: "john@acme.com",
        is_default: true,
      },
      {
        id: "addr_2",
        user_id: userId,
        name: "Jane Smith",
        company: "Tech Solutions",
        street1: "456 Oak Ave",
        street2: "",
        city: "Los Angeles",
        state: "CA",
        zip: "90210",
        country: "US",
        phone: "555-987-6543",
        email: "jane@techsolutions.com",
        is_default: false,
      },
    ],
  }
}
