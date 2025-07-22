"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import type { UserProfile } from "@/lib/types"
import { updateProfile, updateEmail } from "@/lib/auth" // Assuming these actions exist
import { Swal } from "@/components/sweet-alert"
import { useRouter } from "next/navigation"

interface UserProfileClientProps {
  initialProfile: UserProfile
}

export function UserProfileClient({ initialProfile }: UserProfileClientProps) {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailUpdateMessage, setEmailUpdateMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setProfile((prev) => ({ ...prev, [id]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setEmailUpdateMessage(null)

    if (profile.email === initialProfile.email) {
      setError("New email address must be different from the current one.")
      setIsLoading(false)
      return
    }

    try {
      const result = await updateEmail(profile.email)

      if (result.success) {
        setEmailUpdateMessage(result.message || "Email update initiated. Check your new email for confirmation.")
        Swal.success("Email Update Initiated", result.message || "Please check your new email for a confirmation link.")
        // Optionally, you might want to redirect or show a different state
      } else {
        setError(result.error || "Failed to initiate email update.")
        Swal.error("Email Update Failed", result.error || "Failed to update email.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
      Swal.error("Email Update Failed", err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and contact information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" value={profile.first_name || ""} onChange={handleChange} disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" value={profile.last_name || ""} onChange={handleChange} disabled={isLoading} />
              </div>
            </div>
            <div>
              <Label htmlFor="middle_name">Middle Name (Optional)</Label>
              <Input id="middle_name" value={profile.middle_name || ""} onChange={handleChange} disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={profile.phone || ""} onChange={handleChange} disabled={isLoading} />
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

      {/* Email Address Card */}
      <Card>
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
          <CardDescription>
            Update your email address. A confirmation email will be sent to the new address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ""}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Email...
                </>
              ) : (
                "Update Email"
              )}
            </Button>
            {emailUpdateMessage && (
              <div className="mt-4 flex items-center text-green-600">
                <CheckCircle className="mr-2 h-5 w-5" />
                {emailUpdateMessage}
              </div>
            )}
            {error && (
              <div className="mt-4 flex items-center text-red-600">
                <XCircle className="mr-2 h-5 w-5" />
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
