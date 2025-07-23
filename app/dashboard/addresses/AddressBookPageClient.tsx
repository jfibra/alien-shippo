"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Building,
  Home,
  Package,
  Search,
  Filter,
  Download,
  Star,
  Check,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Address {
  id: string
  user_id: string
  name: string
  company_name?: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string
  email?: string
  is_default: boolean
  is_residential: boolean
  address_type: "shipping" | "billing" | "both" | "return"
  validated: boolean
  notes?: string
  created_at: string
  last_used?: string
}

interface AddressBookPageClientProps {
  initialAddresses: Address[]
  userId: string
}

export function AddressBookPageClient({ initialAddresses, userId }: AddressBookPageClientProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [filteredAddresses, setFilteredAddresses] = useState<Address[]>(initialAddresses)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    company_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
    phone: "",
    email: "",
    is_default: false,
    is_residential: true,
    address_type: "shipping" as const,
    notes: "",
  })

  // Filter and search addresses
  useEffect(() => {
    let filtered = addresses

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((addr) => addr.address_type === filterType || addr.address_type === "both")
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (addr) =>
          addr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          addr.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          addr.address_line1.toLowerCase().includes(searchTerm.toLowerCase()) ||
          addr.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          addr.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
          addr.postal_code.includes(searchTerm),
      )
    }

    setFilteredAddresses(filtered)
  }, [addresses, searchTerm, filterType])

  const resetForm = () => {
    setFormData({
      name: "",
      company_name: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US",
      phone: "",
      email: "",
      is_default: false,
      is_residential: true,
      address_type: "shipping",
      notes: "",
    })
  }

  const handleAddAddress = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id: userId }),
      })

      if (!response.ok) throw new Error("Failed to add address")

      const newAddress = await response.json()
      setAddresses((prev) => [...prev, newAddress])
      setIsAddDialogOpen(false)
      resetForm()

      toast({
        title: "Success",
        description: "Address added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditAddress = async () => {
    if (!editingAddress) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/addresses/${editingAddress.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update address")

      const updatedAddress = await response.json()
      setAddresses((prev) => prev.map((addr) => (addr.id === editingAddress.id ? updatedAddress : addr)))
      setIsEditDialogOpen(false)
      setEditingAddress(null)
      resetForm()

      toast({
        title: "Success",
        description: "Address updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update address",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete address")

      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId))

      toast({
        title: "Success",
        description: "Address deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/addresses/${addressId}/set-default`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to set default address")

      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          is_default: addr.id === addressId,
        })),
      )

      toast({
        title: "Success",
        description: "Default address updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set default address",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      name: address.name,
      company_name: address.company_name || "",
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone || "",
      email: address.email || "",
      is_default: address.is_default,
      is_residential: address.is_residential,
      address_type: address.address_type,
      notes: address.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const exportAddresses = () => {
    const csvContent = [
      ["Name", "Company", "Address", "City", "State", "ZIP", "Phone", "Type", "Default"].join(","),
      ...filteredAddresses.map((addr) =>
        [
          addr.name,
          addr.company_name || "",
          `"${addr.address_line1} ${addr.address_line2 || ""}"`,
          addr.city,
          addr.state,
          addr.postal_code,
          addr.phone || "",
          addr.address_type,
          addr.is_default ? "Yes" : "No",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "addresses.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  const getAddressIcon = (type: string, isResidential: boolean) => {
    if (type === "return") return <Package className="h-4 w-4" />
    if (isResidential) return <Home className="h-4 w-4" />
    return <Building className="h-4 w-4" />
  }

  const AddressForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => setFormData((prev) => ({ ...prev, company_name: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address_line1">Address Line 1 *</Label>
        <Input
          id="address_line1"
          value={formData.address_line1}
          onChange={(e) => setFormData((prev) => ({ ...prev, address_line1: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="address_line2">Address Line 2</Label>
        <Input
          id="address_line2"
          value={formData.address_line2}
          onChange={(e) => setFormData((prev) => ({ ...prev, address_line2: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="postal_code">ZIP Code *</Label>
          <Input
            id="postal_code"
            value={formData.postal_code}
            onChange={(e) => setFormData((prev) => ({ ...prev, postal_code: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address_type">Address Type</Label>
        <Select
          value={formData.address_type}
          onValueChange={(value: any) => setFormData((prev) => ({ ...prev, address_type: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shipping">Shipping Only</SelectItem>
            <SelectItem value="billing">Billing Only</SelectItem>
            <SelectItem value="both">Shipping & Billing</SelectItem>
            <SelectItem value="return">Return Address</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_residential"
            checked={formData.is_residential}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_residential: !!checked }))}
          />
          <Label htmlFor="is_residential">Residential Address</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_default"
            checked={formData.is_default}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_default: !!checked }))}
          />
          <Label htmlFor="is_default">Set as Default</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Any special delivery instructions..."
        />
      </div>
    </div>
  )

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">Address Book</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your shipping and return addresses for faster checkout.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>Add a new shipping or billing address to your address book.</DialogDescription>
            </DialogHeader>
            <AddressForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAddress} disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Address"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search addresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Addresses</SelectItem>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="return">Return</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportAddresses}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Address Tabs */}
      <Tabs value={filterType} onValueChange={setFilterType} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({addresses.length})</TabsTrigger>
          <TabsTrigger value="shipping">
            Shipping ({addresses.filter((a) => a.address_type === "shipping" || a.address_type === "both").length})
          </TabsTrigger>
          <TabsTrigger value="billing">
            Billing ({addresses.filter((a) => a.address_type === "billing" || a.address_type === "both").length})
          </TabsTrigger>
          <TabsTrigger value="return">
            Return ({addresses.filter((a) => a.address_type === "return").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filterType} className="mt-6">
          {filteredAddresses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? "No addresses match your search criteria." : "Add your first address to get started."}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Address
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredAddresses.map((address) => (
                <Card key={address.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getAddressIcon(address.address_type, address.is_residential)}
                        <CardTitle className="text-base">{address.name}</CardTitle>
                        {address.is_default && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(address)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(address.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {address.company_name && <CardDescription>{address.company_name}</CardDescription>}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p>{address.address_line1}</p>
                      {address.address_line2 && <p>{address.address_line2}</p>}
                      <p>
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                      {address.phone && <p>📞 {address.phone}</p>}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {address.address_type}
                      </Badge>
                      {address.is_residential && <Badge variant="outline">Residential</Badge>}
                      {address.validated && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    {address.notes && <p className="text-xs text-gray-600 italic">{address.notes}</p>}

                    {!address.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>Update your address information.</DialogDescription>
          </DialogHeader>
          <AddressForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAddress} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
