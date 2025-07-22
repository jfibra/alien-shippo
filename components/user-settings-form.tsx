"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Bell, Shield, Lock, Globe, Save, Trash2, RefreshCcw, Loader2, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { UserProfile } from "@/lib/types"
import { updateProfile } from "@/lib/auth" // Assuming this action exists
import { Swal } from "@/components/sweet-alert"

interface UserPreferences {
  id?: string
  user_id?: string
  date_format: string
  time_zone: string
  weight_unit: string
  dimension_unit: string
  default_service: string
  default_package: string
  auto_refresh_status: boolean
  confirm_actions: boolean
}

interface UserSession {
  id: string
  user_id: string
  device_info: string
  ip_address: string
  last_active: string
  is_current: boolean
}

interface ApiKey {
  id: string
  user_id: string
  key_name: string
  key_value: string
  is_test: boolean
  is_active: boolean
  created_at: string
}

interface UserSettingsFormProps {
  initialPreferences?: UserPreferences
  userSessions: UserSession[]
  apiKeys: ApiKey[]
  initialProfile: UserProfile
}

export function UserSettingsForm({ initialPreferences, userSessions, apiKeys, initialProfile }: UserSettingsFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [activeTab, setActiveTab] = useState("preferences")
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)
  const [isRevealingKey, setIsRevealingKey] = useState<Record<string, boolean>>({})
  const [isDeleteSessionDialogOpen, setIsDeleteSessionDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isGenerateKeyDialogOpen, setIsGenerateKeyDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyIsTest, setNewKeyIsTest] = useState(false)
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [error, setError] = useState<string | null>(null)

  const [preferences, setPreferences] = useState<UserPreferences>(
    initialPreferences || {
      date_format: "MM/DD/YYYY",
      time_zone: "America/New_York",
      weight_unit: "imperial",
      dimension_unit: "imperial",
      default_service: "priority",
      default_package: "small-box",
      auto_refresh_status: true,
      confirm_actions: true,
    },
  )

  const handlePreferenceChange = (name: string, value: string | boolean) => {
    setPreferences((prev) => ({ ...prev, [name]: value }))
  }

  const savePreferences = async () => {
    setIsLoading(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      if (initialPreferences?.id) {
        // Update existing preferences
        const { error } = await supabase
          .from("user_preferences")
          .update({
            date_format: preferences.date_format,
            time_zone: preferences.time_zone,
            weight_unit: preferences.weight_unit,
            dimension_unit: preferences.dimension_unit,
            default_service: preferences.default_service,
            default_package: preferences.default_package,
            auto_refresh_status: preferences.auto_refresh_status,
            confirm_actions: preferences.confirm_actions,
          })
          .eq("id", initialPreferences.id)

        if (error) throw error
      } else {
        // Insert new preferences
        const { error } = await supabase.from("user_preferences").insert({
          user_id: user.id,
          date_format: preferences.date_format,
          time_zone: preferences.time_zone,
          weight_unit: preferences.weight_unit,
          dimension_unit: preferences.dimension_unit,
          default_service: preferences.default_service,
          default_package: preferences.default_package,
          auto_refresh_status: preferences.auto_refresh_status,
          confirm_actions: preferences.confirm_actions,
        })

        if (error) throw error
      }

      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save preferences",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("user_sessions").delete().eq("id", sessionId)

      if (error) throw error

      toast({
        title: "Session deleted",
        description: "The session has been deleted successfully.",
      })

      setIsDeleteSessionDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting session:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete session",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoutAllSessions = async () => {
    setIsLoading(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Delete all sessions except current one
      const { error } = await supabase.from("user_sessions").delete().eq("user_id", user.id).eq("is_current", false)

      if (error) throw error

      toast({
        title: "Sessions logged out",
        description: "All other sessions have been logged out successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error logging out sessions:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log out sessions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateApiKey = async () => {
    setIsGeneratingKey(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Generate a random API key
      const keyValue = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

      // Insert the new API key
      const { error } = await supabase.from("api_keys").insert({
        user_id: user.id,
        key_name: newKeyName,
        key_value: keyValue,
        is_test: newKeyIsTest,
        is_active: true,
      })

      if (error) throw error

      toast({
        title: "API key generated",
        description: "Your new API key has been generated successfully.",
      })

      setIsGenerateKeyDialogOpen(false)
      setNewKeyName("")
      setNewKeyIsTest(false)
      router.refresh()
    } catch (error) {
      console.error("Error generating API key:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate API key",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingKey(false)
    }
  }

  const revokeApiKey = async (keyId: string) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("api_keys").update({ is_active: false, is_deleted: true }).eq("id", keyId)

      if (error) throw error

      toast({
        title: "API key revoked",
        description: "The API key has been revoked successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error revoking API key:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to revoke API key",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRevealKey = (keyId: string) => {
    setIsRevealingKey((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setProfile((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await updateProfile({
        first_name: profile.first_name,
        middle_name: profile.middle_name,
        last_name: profile.last_name,
        phone: profile.phone,
        company: profile.company,
      })

      if (result.success) {
        Swal.success("Profile Updated", "Your profile information has been saved.")
        router.refresh() // Revalidate data
      } else {
        setError(result.error || "Failed to update profile.")
        Swal.error("Update Failed", result.error || "Failed to update profile.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
      Swal.error("Update Failed", err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-3">
        <Card>
          <CardContent className="p-0">
            <nav className="flex flex-col p-0">
              <button
                className={`flex items-center px-4 py-3 text-sm font-medium border-l-2 ${
                  activeTab === "preferences"
                    ? "border-navy bg-navy/5 text-navy"
                    : "border-transparent hover:bg-gray-50 text-gray-600"
                }`}
                onClick={() => setActiveTab("preferences")}
              >
                <Globe className="mr-3 h-5 w-5" />
                Preferences
              </button>
              <button
                className={`flex items-center px-4 py-3 text-sm font-medium border-l-2 ${
                  activeTab === "password"
                    ? "border-navy bg-navy/5 text-navy"
                    : "border-transparent hover:bg-gray-50 text-gray-600"
                }`}
                onClick={() => setActiveTab("password")}
              >
                <Lock className="mr-3 h-5 w-5" />
                Password & Security
              </button>
              <button
                className={`flex items-center px-4 py-3 text-sm font-medium border-l-2 ${
                  activeTab === "notifications"
                    ? "border-navy bg-navy/5 text-navy"
                    : "border-transparent hover:bg-gray-50 text-gray-600"
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="mr-3 h-5 w-5" />
                Notifications
              </button>
              <button
                className={`flex items-center px-4 py-3 text-sm font-medium border-l-2 ${
                  activeTab === "api"
                    ? "border-navy bg-navy/5 text-navy"
                    : "border-transparent hover:bg-gray-50 text-gray-600"
                }`}
                onClick={() => setActiveTab("api")}
              >
                <Shield className="mr-3 h-5 w-5" />
                API Keys
              </button>
              <button
                className={`flex items-center px-4 py-3 text-sm font-medium border-l-2 ${
                  activeTab === "profile"
                    ? "border-navy bg-navy/5 text-navy"
                    : "border-transparent hover:bg-gray-50 text-gray-600"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <Globe className="mr-3 h-5 w-5" />
                Profile
              </button>
            </nav>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-12 md:col-span-9">
        {activeTab === "preferences" && (
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Customize your shipping platform experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Regional Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_format">Date Format</Label>
                    <Select
                      value={preferences.date_format}
                      onValueChange={(value) => handlePreferenceChange("date_format", value)}
                    >
                      <SelectTrigger id="date_format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="time_zone">Time Zone</Label>
                    <Select
                      value={preferences.time_zone}
                      onValueChange={(value) => handlePreferenceChange("time_zone", value)}
                    >
                      <SelectTrigger id="time_zone">
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="weight_unit">Weight Unit</Label>
                    <Select
                      value={preferences.weight_unit}
                      onValueChange={(value) => handlePreferenceChange("weight_unit", value)}
                    >
                      <SelectTrigger id="weight_unit">
                        <SelectValue placeholder="Select weight unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imperial">Imperial (lb, oz)</SelectItem>
                        <SelectItem value="metric">Metric (kg, g)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dimension_unit">Dimension Unit</Label>
                    <Select
                      value={preferences.dimension_unit}
                      onValueChange={(value) => handlePreferenceChange("dimension_unit", value)}
                    >
                      <SelectTrigger id="dimension_unit">
                        <SelectValue placeholder="Select dimension unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imperial">Imperial (in)</SelectItem>
                        <SelectItem value="metric">Metric (cm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Default Values</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="default_service">Default Service</Label>
                    <Select
                      value={preferences.default_service}
                      onValueChange={(value) => handlePreferenceChange("default_service", value)}
                    >
                      <SelectTrigger id="default_service">
                        <SelectValue placeholder="Select default service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="priority">USPS Priority Mail</SelectItem>
                        <SelectItem value="first-class">USPS First-Class Package</SelectItem>
                        <SelectItem value="ground">UPS Ground</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="default_package">Default Package Type</Label>
                    <Select
                      value={preferences.default_package}
                      onValueChange={(value) => handlePreferenceChange("default_package", value)}
                    >
                      <SelectTrigger id="default_package">
                        <SelectValue placeholder="Select default package" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small-box">Small Box</SelectItem>
                        <SelectItem value="medium-box">Medium Box</SelectItem>
                        <SelectItem value="large-box">Large Box</SelectItem>
                        <SelectItem value="envelope">Envelope</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Interface Preferences</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto_refresh_status" className="text-base font-medium">
                      Auto-refresh Shipment Status
                    </Label>
                    <p className="text-sm text-gray-500">
                      Automatically update shipment status without refreshing the page
                    </p>
                  </div>
                  <Switch
                    id="auto_refresh_status"
                    checked={preferences.auto_refresh_status}
                    onCheckedChange={(checked) => handlePreferenceChange("auto_refresh_status", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="confirm_actions" className="text-base font-medium">
                      Confirm Important Actions
                    </Label>
                    <p className="text-sm text-gray-500">
                      Show confirmation dialogs for important actions like deleting
                    </p>
                  </div>
                  <Switch
                    id="confirm_actions"
                    checked={preferences.confirm_actions}
                    onCheckedChange={(checked) => handlePreferenceChange("confirm_actions", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-5">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Cancel
              </Button>
              <Button variant="gold" onClick={savePreferences} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Preferences
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "password" && (
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Update your password or enable two-factor authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>

                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>

                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>

                <Button>Update Password</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Not enabled</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sessions</h3>
                <p className="text-sm text-gray-500">Manage your active login sessions</p>

                <div className="space-y-2">
                  {userSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`${
                        session.is_current ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"
                      } border p-3 rounded-lg`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{session.device_info || "Unknown Device"}</div>
                          <div className="text-xs text-gray-500">IP: {session.ip_address || "Unknown"}</div>
                          <div className="text-xs text-gray-500">
                            Last active: {new Date(session.last_active).toLocaleString()}
                          </div>
                        </div>
                        {!session.is_current && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 bg-transparent"
                            onClick={() => {
                              setSessionToDelete(session.id)
                              setIsDeleteSessionDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Logout
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleLogoutAllSessions}
                  disabled={isLoading}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Logout of All Other Sessions
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-5">
              <div className="text-sm text-gray-500">Last password change: 3 months ago</div>
            </CardFooter>
          </Card>
        )}

        {activeTab === "notifications" && (
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control which notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-shipments" className="text-base font-medium">
                      Shipment Updates
                    </Label>
                    <p className="text-sm text-gray-500">Receive emails about your shipment status changes</p>
                  </div>
                  <Switch id="notify-shipments" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-balance" className="text-base font-medium">
                      Balance Updates
                    </Label>
                    <p className="text-sm text-gray-500">Receive emails when funds are added or used</p>
                  </div>
                  <Switch id="notify-balance" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-promotions" className="text-base font-medium">
                      Promotions & News
                    </Label>
                    <p className="text-sm text-gray-500">Receive updates about new features and shipping promotions</p>
                  </div>
                  <Switch id="notify-promotions" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">In-App Notifications</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-app-shipments" className="text-base font-medium">
                      Shipment Updates
                    </Label>
                    <p className="text-sm text-gray-500">Receive in-app notifications for shipment status changes</p>
                  </div>
                  <Switch id="notify-app-shipments" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-app-balance" className="text-base font-medium">
                      Balance Updates
                    </Label>
                    <p className="text-sm text-gray-500">Receive in-app notifications for balance changes</p>
                  </div>
                  <Switch id="notify-app-balance" defaultChecked />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Notification Email</h3>
                <p className="text-sm text-gray-500 mb-4">Choose where to receive email notifications</p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="email-primary" name="email-preference" className="h-4 w-4" defaultChecked />
                    <Label htmlFor="email-primary">Primary Email</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="radio" id="email-alternate" name="email-preference" className="h-4 w-4" />
                    <Label htmlFor="email-alternate">Add an alternate email address</Label>
                  </div>

                  <Input placeholder="alternate@example.com" disabled />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-5">
              <Button variant="outline">Cancel</Button>
              <Button variant="gold">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "api" && (
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys for integrating with Viking Freight</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">API Documentation</h3>
                <p className="text-sm text-gray-500">
                  Our API allows you to programmatically create shipments, get rates, and more. View our documentation
                  to get started.
                </p>
                <Button variant="outline">View API Documentation</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Your API Keys</h3>
                  <Button variant="outline" onClick={() => setIsGenerateKeyDialogOpen(true)}>
                    Generate New Key
                  </Button>
                </div>

                {apiKeys.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">No API keys yet</h3>
                    <p className="mt-1 text-gray-500">Generate an API key to get started with our API</p>
                    <Button
                      variant="outline"
                      className="mt-4 bg-transparent"
                      onClick={() => setIsGenerateKeyDialogOpen(true)}
                    >
                      Generate API Key
                    </Button>
                  </div>
                ) : (
                  apiKeys.map((key) => (
                    <div key={key.id} className="border rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{key.key_name}</h4>
                            <p className="text-xs text-gray-500">
                              Created: {new Date(key.created_at).toLocaleDateString()}
                              {key.is_test && " • Test Key"}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => revokeApiKey(key.id)}
                              disabled={isLoading}
                            >
                              Revoke
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm overflow-x-auto">
                          {isRevealingKey[key.id] ? key.key_value : "••••••••••••••••••••••••••••••••••••••••••••"}
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button variant="outline" size="sm" onClick={() => toggleRevealKey(key.id)}>
                            {isRevealingKey[key.id] ? "Hide Key" : "Reveal Key"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">API Usage</h3>
                <p className="text-sm text-gray-500">Track your API usage and limits here.</p>
                <Button variant="outline">View API Logs</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profile.first_name || ""}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profile.last_name || ""}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="middle_name">Middle Name (Optional)</Label>
                  <Input
                    id="middle_name"
                    value={profile.middle_name || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input id="company" value={profile.company || ""} onChange={handleChange} disabled={isLoading} />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
                {error && (
                  <div className="mt-4 flex items-center text-red-600">
                    <XCircle className="mr-2 h-5 w-5" />
                    {error}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Session Dialog */}
      <Dialog open={isDeleteSessionDialogOpen} onOpenChange={setIsDeleteSessionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Out Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out this session? This will immediately terminate the session.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteSessionDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => sessionToDelete && handleDeleteSession(sessionToDelete)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging Out...
                </>
              ) : (
                "Log Out Session"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate API Key Dialog */}
      <Dialog open={isGenerateKeyDialogOpen} onOpenChange={setIsGenerateKeyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate API Key</DialogTitle>
            <DialogDescription>Create a new API key for integrating with Viking Freight services.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g. Production Key, Test Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Give your key a descriptive name to help you identify it later
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-test-key"
                className="h-4 w-4"
                checked={newKeyIsTest}
                onChange={(e) => setNewKeyIsTest(e.target.checked)}
              />
              <Label htmlFor="is-test-key">This is a test key</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateKeyDialogOpen(false)} disabled={isGeneratingKey}>
              Cancel
            </Button>
            <Button variant="gold" onClick={generateApiKey} disabled={isGeneratingKey || !newKeyName}>
              {isGeneratingKey ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                "Generate Key"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
