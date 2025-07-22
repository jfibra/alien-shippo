"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar, RefreshCw, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserActivityLogs, type ActivityLogType } from "@/lib/activity-service"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"

interface ActivityLog {
  id: string
  user_id: string
  action: string
  details: Record<string, any>
  ip_address: string
  user_agent: string
  created_at: string
}

interface ActivityPageClientProps {
  initialActivityLogs: ActivityLog[]
}

export default function ActivityPageClient({ initialActivityLogs }: ActivityPageClientProps) {
  const [activities, setActivities] = useState<ActivityLogType[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState("all")
  const [tableFilter, setTableFilter] = useState("all")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isStartDateOpen, setIsStartDateOpen] = useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<ActivityLogType | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  const fetchActivities = async () => {
    setIsLoading(true)
    try {
      const filters: any = {}

      if (actionFilter !== "all") {
        filters.action = actionFilter
      }

      if (tableFilter !== "all") {
        filters.target_table = tableFilter
      }

      if (startDate) {
        filters.startDate = startDate.toISOString()
      }

      if (endDate) {
        filters.endDate = endDate.toISOString()
      }

      if (searchQuery) {
        filters.search = searchQuery
      }

      const { data, count } = await getUserActivityLogs(currentPage, pageSize, filters)
      setActivities(data)
      setTotalCount(count)
    } catch (error) {
      console.error("Error fetching activities:", error)
      toast({
        title: "Error",
        description: "Failed to fetch activities",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [currentPage, pageSize, actionFilter, tableFilter, startDate, endDate, searchQuery])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchActivities()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, currentPage, pageSize, actionFilter, tableFilter, startDate, endDate, searchQuery])

  const totalPages = Math.ceil(totalCount / pageSize)

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number.parseInt(value))
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setActionFilter("all")
    setTableFilter("all")
    setStartDate(undefined)
    setEndDate(undefined)
    setSearchQuery("")
    setFilterType("all")
    setCurrentPage(1)
  }

  const handleSelectActivity = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId],
    )
  }

  const handleSelectAll = () => {
    if (selectedActivities.length === activities.length) {
      setSelectedActivities([])
    } else {
      setSelectedActivities(activities.map((a) => a.id))
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    try {
      const response = await fetch(`/api/activity-logs/${activityId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete activity")
      }

      setActivities((prev) => prev.filter((a) => a.id !== activityId))
      setSelectedActivities((prev) => prev.filter((id) => id !== activityId))

      toast({
        title: "Success",
        description: "Activity deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete activity",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setActivityToDelete(null)
    }
  }

  const handleBulkDelete = async () => {
    try {
      const response = await fetch("/api/activity-logs/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activityIds: selectedActivities }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete activities")
      }

      setActivities((prev) => prev.filter((a) => !selectedActivities.includes(a.id)))
      setSelectedActivities([])

      toast({
        title: "Success",
        description: `${selectedActivities.length} activities deleted successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete activities",
        variant: "destructive",
      })
    }
  }

  const getActivityIcon = (action: string) => {
    if (action.includes("created")) return "🆕"
    if (action.includes("updated")) return "🔄"
    if (action.includes("deleted")) return "🗑️"
    if (action.includes("login")) return "🔑"
    if (action.includes("payment")) return "💰"
    if (action.includes("shipment")) return "📦"
    return "📝"
  }

  const getActivityBadgeColor = (action: string) => {
    if (action.includes("created")) return "bg-green-100 text-green-800"
    if (action.includes("updated")) return "bg-blue-100 text-blue-800"
    if (action.includes("deleted")) return "bg-red-100 text-red-800"
    if (action.includes("login")) return "bg-purple-100 text-purple-800"
    if (action.includes("payment")) return "bg-yellow-100 text-yellow-800"
    if (action.includes("shipment")) return "bg-indigo-100 text-indigo-800"
    return "bg-gray-100 text-gray-800"
  }

  const formatActivityAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const exportActivities = () => {
    const csvContent = [
      ["Date", "Action", "Table", "Target ID", "IP Address", "User Agent"].join(","),
      ...activities.map((activity) =>
        [
          format(new Date(activity.created_at), "yyyy-MM-dd HH:mm:ss"),
          formatActivityAction(activity.action),
          activity.target_table || "",
          activity.target_id || "",
          activity.ip_address || "",
          activity.user_agent || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `activity_log_${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const uniqueTables = [...new Set(activities.map((a) => a.target_table).filter(Boolean))]
  const uniqueActions = [...new Set(activities.map((a) => a.action))]

  const filteredLogs = activities.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip_address.includes(searchQuery)

    const matchesType = filterType === "all" || log.action.toLowerCase().includes(filterType.toLowerCase())

    return matchesSearch && matchesType
  })

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate fetching new data
    setTimeout(() => {
      // In a real app, you'd fetch new data here
      // For now, we'll just re-use the initial data or generate new mock data
      setActivities(initialActivityLogs) // Or generate fresh mock data
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">Activity History</h1>
          <p className="text-sm text-muted-foreground mt-1">Review your recent account activities.</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Activity
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Filters & Settings</CardTitle>
              <CardDescription>Customize your activity view</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="auto-refresh">Auto-refresh</Label>
              <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="mb-2 block">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search activities..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="action-filter" className="mb-2 block">
                Action
              </Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {formatActivityAction(action)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="table-filter" className="mb-2 block">
                Table
              </Label>
              <Select value={tableFilter} onValueChange={setTableFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All tables" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tables</SelectItem>
                  {uniqueTables.map((table) => (
                    <SelectItem key={table} value={table!}>
                      {table}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Date Range</Label>
              <div className="flex gap-2">
                <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM d") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date)
                        setIsStartDateOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "MMM d") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date)
                        setIsEndDateOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button variant="ghost" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
            <Button variant="ghost" size="sm" onClick={fetchActivities} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Activity</CardTitle>
          <CardDescription>Search and filter your activity logs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search actions, details, or IP address..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4 text-gray-500" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="shipment_created">Shipment Created</SelectItem>
                <SelectItem value="funds_added">Funds Added</SelectItem>
                <SelectItem value="profile_update">Profile Update</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Activity Log</CardTitle>
            <div className="text-sm text-muted-foreground">{totalCount} total activities</div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLogs.length > 0 ? (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{log.action.replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.ip_address} - {formatDate(log.created_at)}
                    </p>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <p className="text-xs text-gray-600 mt-1">Details: {JSON.stringify(log.details)}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No activity logs found matching your criteria.</div>
          )}
        </CardContent>
      </Card>

      {/* Activity Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
            <DialogDescription>Detailed information about this activity</DialogDescription>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Action</Label>
                  <p className="text-sm">{formatActivityAction(selectedActivity.action)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm">{format(new Date(selectedActivity.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Table</Label>
                  <p className="text-sm">{selectedActivity.target_table || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Target ID</Label>
                  <p className="text-sm font-mono">{selectedActivity.target_id || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">IP Address</Label>
                  <p className="text-sm font-mono">{selectedActivity.ip_address || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">User Agent</Label>
                  <p className="text-sm truncate" title={selectedActivity.user_agent || "N/A"}>
                    {selectedActivity.user_agent || "N/A"}
                  </p>
                </div>
              </div>

              {selectedActivity.meta && Object.keys(selectedActivity.meta).length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Metadata</Label>
                  <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto max-h-40 border">
                    {JSON.stringify(selectedActivity.meta, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Activity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => activityToDelete && handleDeleteActivity(activityToDelete)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
