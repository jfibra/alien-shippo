"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Address } from "@/lib/types"
import { addAddress, updateAddress, deleteAddress } from "@/lib/address-service"
import { Swal } from "@/components/sweet-alert"
import { useRouter } from "next/navigation"
import { setError } from "@/lib/error-handler" // Declare setError variable

interface AddressBookProps {
  initialAddresses: Address[]
  userId: string
}

export function AddressBook({ initialAddresses, userId }: AddressBookProps) {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<Partial<Address> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [validationStatus, setValidationStatus] = useState<"idle" | "validating" | "success" | "error">("idle")
  const [validationMessage, setValidationMessage] = useState<string | null>(null)

  const handleOpenDialog = (address?: Address) => {
    setCurrentAddress(address || { user_id: userId, is_residential: false })
    setValidationStatus("idle")
    setValidationMessage(null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setCurrentAddress(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setCurrentAddress((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string | boolean) => {
    setCurrentAddress((prev) => ({ ...prev, [id]: value }))
  }

  const handleValidateAddress = async () => {
    if (
      !currentAddress?.street1 ||
      !currentAddress?.city ||
      !currentAddress?.state ||
      !currentAddress?.zip ||
      !currentAddress?.country
    ) {
      setValidationStatus("error")
      setValidationMessage("Please fill in all required address fields before validating.")
      return
    }

    setValidationStatus("validating")
    setValidationMessage(null)

    try {
      const response = await fetch("/api/validate-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          street1: currentAddress.street1,
          street2: currentAddress.street2,
          city: currentAddress.city,
          state: currentAddress.state,
          zip: currentAddress.zip,
          country: currentAddress.country,
        }),
      })

      const data = await response.json()

      if (data.success && data.isValid) {
        setValidationStatus("success")
        setValidationMessage("Address validated successfully!")
        // Optionally update currentAddress with normalizedAddress if provided
        if (data.normalizedAddress) {
          setCurrentAddress((prev) => ({ ...prev, ...data.normalizedAddress }))
        }
      } else {
        setValidationStatus("error")
        setValidationMessage(data.messages ? data.messages.join(", ") : "Address could not be validated.")
      }
    } catch (error) {
      console.error("Address validation API error:", error)
      setValidationStatus("error")
      setValidationMessage("An error occurred during validation. Please try again.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null) // Clear previous errors

    if (
      !currentAddress?.name ||
      !currentAddress?.street1 ||
      !currentAddress?.city ||
      !currentAddress?.state ||
      !currentAddress?.zip ||
      !currentAddress?.country
    ) {
      setError("Please fill in all required fields.")
      setIsLoading(false)
      return
    }

    try {
      let result
      if (currentAddress.id) {
        result = await updateAddress(currentAddress as Address)
      } else {
        result = await addAddress(currentAddress as Omit<Address, "id" | "created_at" | "updated_at">)
      }

      if (result.success) {
        Swal.success("Success", `Address ${currentAddress.id ? "updated" : "added"} successfully!`)
        router.refresh() // Revalidate data
        handleCloseDialog()
      } else {
        setError(result.error || "Failed to save address.")
        Swal.error("Error", result.error || "Failed to save address.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
      Swal.error("Error", err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true)
        try {
          const result = await deleteAddress(id)
          if (result.success) {
            Swal.success("Deleted!", "Your address has been deleted.")
            router.refresh() // Revalidate data
          } else {
            Swal.error("Error", result.error || "Failed to delete address.")
          }
        } catch (err: any) {
          Swal.error("Error", err.message || "An unexpected error occurred.")
        } finally {
          setIsLoading(false)
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-center text-gray-500">No addresses found. Add your first address!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <Card key={address.id} className="relative">
              <CardHeader>
                <CardTitle>{address.name}</CardTitle>
                <CardDescription>
                  {address.street1}
                  {address.street2 && `, ${address.street2}`}
                  <br />
                  {address.city}, {address.state} {address.zip}
                  <br />
                  {address.country}
                  {address.phone && (
                    <>
                      <br />
                      Phone: {address.phone}
                    </>
                  )}
                  {address.email && (
                    <>
                      <br />
                      Email: {address.email}
                    </>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleOpenDialog(address)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(address.id!)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentAddress?.id ? "Edit Address" : "Add New Address"}</DialogTitle>
            <DialogDescription>
              {currentAddress?.id ? "Update the details of your address." : "Add a new address to your address book."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentAddress?.name || ""}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street1" className="text-right">
                Street 1
              </Label>
              <Input
                id="street1"
                value={currentAddress?.street1 || ""}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street2" className="text-right">
                Street 2
              </Label>
              <Input
                id="street2"
                value={currentAddress?.street2 || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input
                id="city"
                value={currentAddress?.city || ""}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="state" className="text-right">
                State/Province
              </Label>
              <Input
                id="state"
                value={currentAddress?.state || ""}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zip" className="text-right">
                Zip/Postal Code
              </Label>
              <Input
                id="zip"
                value={currentAddress?.zip || ""}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                Country
              </Label>
              <Input
                id="country"
                value={currentAddress?.country || ""}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" value={currentAddress?.phone || ""} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={currentAddress?.email || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_residential" className="text-right">
                Residential
              </Label>
              <Select
                value={currentAddress?.is_residential ? "true" : "false"}
                onValueChange={(val) => handleSelectChange("is_residential", val === "true")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4 flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleValidateAddress}
                disabled={isLoading || validationStatus === "validating"}
              >
                {validationStatus === "validating" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                {validationStatus === "validating" ? "Validating..." : "Validate Address"}
              </Button>
            </div>
            {validationStatus !== "idle" && validationMessage && (
              <div
                className={`col-span-4 text-sm ${validationStatus === "success" ? "text-green-600" : "text-red-600"} flex items-center gap-2`}
              >
                {validationStatus === "success" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {validationMessage}
              </div>
            )}
            <DialogFooter className="col-span-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Address"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
