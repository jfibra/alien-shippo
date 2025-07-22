"use client"

import { useState, useEffect, useCallback } from "react"
import { getAccountBalance } from "@/lib/balance-service"
import { getRecentShipments } from "@/lib/shipping-service"
import { getRecentActivity } from "@/lib/user-activity-service"
import type { AccountBalance, Shipment, UserActivity } from "@/lib/types"
import { useAuth } from "@/components/auth-provider" // Assuming useAuth provides user and isLoading

export function useDashboardData() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [balance, setBalance] = useState<AccountBalance | null>(null)
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([])
  const [recentActivity, setRecentActivity] = useState<UserActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const [balanceData, shipmentsData, activityData] = await Promise.all([
        getAccountBalance(user.id),
        getRecentShipments(user.id, 5), // Fetch last 5 shipments
        getRecentActivity(user.id, 5), // Fetch last 5 activities
      ])

      setBalance(balanceData)
      setRecentShipments(shipmentsData)
      setRecentActivity(activityData)
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err)
      setError(err.message || "Failed to load dashboard data.")
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (!isAuthLoading) {
      fetchData()
    }
  }, [isAuthLoading, fetchData])

  return { balance, recentShipments, recentActivity, isLoading, error, refetch: fetchData }
}
