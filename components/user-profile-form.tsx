"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { updateUserProfile, updateUserEmail, deactivateAccount } from "@/app/actions/user-profile"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Save, Mail, Trash2 } from "lucide-react"

interface UserProfileData {
  id: string
  email: string
  first_name: string
  middle_name: string | null
  last_name: string
  full_name: string
  phone: string | null
  company: string | null
  website: string | null
  bio: string | null
  role: string
  email_verified: boolean
  is_active: boolean
  email_notifications: boolean
  app_notifications: boolean
  created_at: string
  updated_at: string
  last_login: string | null
  last_active: string | null
  profile_image_url: string | null
  is_deleted: boolean
}

interface UserProfileFormProps {
  initialData: UserProfileData
}

export function UserProfileForm({ initialData }: UserProfileFormProps) {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name,
    middle_name: initialData.middle_name || "",
    last_name: initialData.last_name,
    phone: initialData.phone || "",
    company: initialData.company || "",
    website: initialData.website || "",
    bio: initialData.bio || "",
    email_notifications: initialData.email_notifications,
    app_notifications: initialData.app_notifications,
  })

  const [emailData, setEmailData] = useState({
    email: initialData.email,
  })

  const [isPending, startTransition] = useTransition()
  const [isEmailPending, startEmailTransition] = useTransition()
  const [isDeactivating, startDeactivateTransition] = useTransition()
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const formDataObj = new FormData()

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value.toString())
      })

      const result = await updateUserProfile(formDataObj)

      if (result.success) {
        toast({
          title: "Profile Updated",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    })
  }

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    startEmailTransition(async () => {
      const formDataObj = new FormData()
      formDataObj.append("email", emailData.email)

      const result = await updateUserEmail(formDataObj)

      if (result.success) {
        toast({
          title: "Email Update Initiated",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    })
  }

  const handleDeactivateAccount = async () => {
    startDeactivateTransition(async () => {
      const result = await deactivateAccount()

      if (result.success) {
        toast({
          title: "Account Deactivated",
          description: result.message,
        })
        // User will be redirected to login by the server action
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and contact information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input
                id="middle_name"
                value={formData.middle_name}
                onChange={(e) => handleInputChange("middle_name", e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://example.com"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                maxLength={500}
                disabled={isPending}
              />
              <p className="text-sm text-gray-500">{formData.bio.length}/500 characters</p>
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Profile
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>Manage your email address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={emailData.email}
                  onChange={(e) => setEmailData({ email: e.target.value })}
                  required
                  disabled={isEmailPending}
                  className="flex-1"
                />
                <Button type="submit" disabled={isEmailPending} variant="outline">
                  {isEmailPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Update Email
                    </>
                  )}
                </Button>
              </div>
              {!initialData.email_verified && (
                <p className="text-sm text-amber-600">
                  Your email address is not verified. Please check your inbox for a verification email.
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>View your account details and manage account settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Account Type</Label>
              <p className="text-sm capitalize">{initialData.role}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Member Since</Label>
              <p className="text-sm">{new Date(initialData.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
              <p className="text-sm">{new Date(initialData.updated_at).toLocaleDateString()}</p>
            </div>
          </div>

          <Separator />

          <div className="pt-4">
            <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
            <p className="text-sm text-gray-600 mb-4">
              Once you deactivate your account, you will lose access to all your data and settings.
            </p>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeactivating}>
                  {isDeactivating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deactivating...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deactivate Account
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will deactivate your account and sign you out. You can reactivate your account by
                    contacting support.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeactivateAccount} className="bg-red-600 hover:bg-red-700">
                    Deactivate Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
