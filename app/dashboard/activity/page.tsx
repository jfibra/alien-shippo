import type { Metadata } from "next"
import ActivityPageClient from "./activity-page-client"

export const metadata: Metadata = {
  title: "Activity History | Viking Freight",
  description: "View your account activity history",
}

// Mock data for activity logs
const mockActivityLogs = [
  {
    id: "log_1",
    user_id: "mock_user_1",
    action: "login",
    details: { method: "password" },
    ip_address: "192.168.1.1",
    user_agent: "Mozilla/5.0 (Desktop)",
    created_at: "2024-07-15T10:00:00Z",
  },
  {
    id: "log_2",
    user_id: "mock_user_1",
    action: "shipment_created",
    details: { tracking_number: "TRK123456789", carrier: "USPS" },
    ip_address: "192.168.1.1",
    user_agent: "Mozilla/5.0 (Desktop)",
    created_at: "2024-07-15T10:30:00Z",
  },
  {
    id: "log_3",
    user_id: "mock_user_1",
    action: "funds_added",
    details: { amount: 50, method: "PayPal" },
    ip_address: "192.168.1.2",
    user_agent: "Mozilla/5.0 (Mobile)",
    created_at: "2024-07-14T15:00:00Z",
  },
  {
    id: "log_4",
    user_id: "mock_user_1",
    action: "profile_update",
    details: { field: "email", old_value: "old@example.com", new_value: "demo@vikingfreight.com" },
    ip_address: "192.168.1.1",
    user_agent: "Mozilla/5.0 (Desktop)",
    created_at: "2024-07-13T09:00:00Z",
  },
  {
    id: "log_5",
    user_id: "mock_user_1",
    action: "login",
    details: { method: "magic_link" },
    ip_address: "192.168.1.3",
    user_agent: "Mozilla/5.0 (Tablet)",
    created_at: "2024-07-12T18:00:00Z",
  },
]

export default function ActivityPage() {
  return <ActivityPageClient initialActivityLogs={mockActivityLogs} />
}
