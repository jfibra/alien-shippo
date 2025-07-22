"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { register } from "@/app/actions/auth"
import { toast } from "sonner"

export function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      toast.error("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      toast.error("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    const submitFormData = new FormData()
    submitFormData.append("firstName", formData.firstName)
    // Only append middleName if it's not empty
    if (formData.middleName.trim()) {
      submitFormData.append("middleName", formData.middleName)
    }
    submitFormData.append("lastName", formData.lastName)
    submitFormData.append("email", formData.email)
    submitFormData.append("password", formData.password)
    submitFormData.append("confirmPassword", formData.confirmPassword)

    try {
      const result = await register(submitFormData)

      if (!result.success) {
        setError(result.error || "Registration failed")
        toast.error(result.error || "Registration failed")
      } else {
        toast.success("Registration successful! Please check your email to verify your account.")
        // The register function will redirect to verify-email page
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full"
            placeholder="John"
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full"
            placeholder="Doe"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="middleName">Middle Name (Optional)</Label>
        <Input
          id="middleName"
          name="middleName"
          type="text"
          autoComplete="additional-name"
          value={formData.middleName}
          onChange={handleInputChange}
          className="w-full"
          placeholder="Middle name"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          className="w-full"
          placeholder="your.email@example.com"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pr-10"
            placeholder="••••••••"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full pr-10"
            placeholder="••••••••"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      <Button type="submit" variant="default" className="w-full bg-gold hover:bg-gold/90" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing up...
          </>
        ) : (
          "Sign up"
        )}
      </Button>
    </form>
  )
}

export default SignupForm
