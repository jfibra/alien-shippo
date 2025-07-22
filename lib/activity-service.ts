/**
 * Lightweight, **client-safe** activity-log helpers.
 * We purposefully avoid `next/headers` and other server-only imports
 * so this file can be imported from Client Components.
 *
 * Replace the mock implementations with real API calls as needed.
 */

export type ActivityLog = {
  id: string
  user_id: string
  action: string
  description: string
  created_at: string
}

/**
 * Client-side mock – fetches recent activity logs.
 * Swap with a real fetch(`/api/activity-logs`) when backend is ready.
 */
export async function getUserActivityLogs(
  _page: number,
  _pageSize: number,
  _filters: Record<string, any>,
): Promise<{ data: ActivityLog[]; count: number }> {
  // Demo/mock data
  const data: ActivityLog[] = [
    {
      id: "1",
      user_id: "demo",
      action: "shipment_created",
      description: "Created shipment #ABC123",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "demo",
      action: "funds_added",
      description: "Added $50.00 to balance",
      created_at: new Date(Date.now() - 3600_000).toISOString(),
    },
  ]
  return { data, count: data.length }
}
