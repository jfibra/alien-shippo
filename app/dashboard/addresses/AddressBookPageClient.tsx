"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PlusCircle,
  Pencil,
  Trash2,
  Copy,
  Loader2,
  AlertCircle,
  Search,
  X,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  Eye,
  EyeOff,
  Plus,
  Edit,
  MapPin,
  Building2,
  Phone,
  Mail,
} from "lucide-react"
import type { Address } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

type AddressFormData = {
  name: string
  company_name: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  postal_code: string
  country: string
  company: string
  is_residential: boolean
  address_type: "shipping" | "billing" | "both"
  is_default: boolean
  skip_validation: boolean
}

type ValidationResult = {
  is_valid: boolean
  messages: string[]
  suggested_address?: Partial<AddressFormData>
}

type CSVRow = {
  name: string
  company_name?: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  is_residential: boolean
  address_type: "shipping" | "billing" | "both"
  is_default: boolean
}

type SortField =
  | "name"
  | "company_name"
  | "address_line1"
  | "city"
  | "state"
  | "postal_code"
  | "country"
  | "is_residential"
  | "is_default"
type SortDirection = "asc" | "desc"

interface AddressNew {
  id: string
  user_id: string
  name: string
  recipient: string
  company?: string | null
  address1: string
  address2?: string | null
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string | null
  email?: string | null
  address_type: "shipping" | "return" | "both" | "billing"
  type: "residential" | "commercial"
  is_default: boolean
  created_at: string
}

interface AddressBookPageClientProps {
  initialAddresses: AddressNew[]
}

export default function AddressBookPageClient({ initialAddresses }: AddressBookPageClientProps) {
  const [addresses, setAddresses] = useState<AddressNew[]>(initialAddresses)
  const [editingAddress, setEditingAddress] = useState<AddressNew | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const { toast } = useToast()

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAddress) return

    // Simulate API call
    setTimeout(() => {
      if (isAddingNew) {
        setAddresses([
          ...addresses,
          { ...editingAddress, id: `mock_${Date.now()}`, created_at: new Date().toISOString() },
        ])
        toast({ title: "Address Added", description: "New address has been added successfully." })
      } else {
        setAddresses(addresses.map((addr) => (addr.id === editingAddress.id ? editingAddress : addr)))
        toast({ title: "Address Updated", description: "Address has been updated successfully." })
      }
      setEditingAddress(null)
      setIsAddingNew(false)
    }, 500)
  }

  const handleDeleteAddress = (id: string) => {
    // Simulate API call
    setTimeout(() => {
      setAddresses(addresses.filter((addr) => addr.id !== id))
      toast({ title: "Address Deleted", description: "Address has been removed." })
    }, 500)
  }

  const handleSetDefault = (id: string, type: "shipping" | "return" | "billing") => {
    // Simulate API call
    setTimeout(() => {
      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          is_default:
            addr.id === id || (addr.address_type === type && addr.id !== id && addr.is_default) ? true : false,
        })),
      )
      toast({ title: "Default Set", description: `Default ${type} address updated.` })
    }, 500)
  }

  const renderAddressForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>{isAddingNew ? "Add New Address" : "Edit Address"}</CardTitle>
        <CardDescription>Fill in the details for your address.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Address Name</Label>
            <Input
              id="name"
              value={editingAddress?.name || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress!, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Name</Label>
            <Input
              id="recipient"
              value={editingAddress?.recipient || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress!, recipient: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2 col-span-full">
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              value={editingAddress?.company || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress!, company: e.target.value })}
            />
          </div>
          <div className="space-y-2 col-span-full">
            <Label htmlFor="address1">Address Line 1</Label>
            <Input
              id="address1"
              value={editingAddress?.address1 || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress!, address1: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2 col-span-full">
            <Label htmlFor="address2">Address Line 2 (Optional)</Label>
            <Input
              id="address2"
              value={editingAddress?.address2 || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress!, address2: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={editingAddress?.city || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress!, city: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              value={editingAddress?.state || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress!, state: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              value={editingAddress?.postal_code || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress!, postal_code: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={editingAddress?.country || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress!, country: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              value={editingAddress?.phone || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress!, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={editingAddress?.email || ""}
              onChange={(e) => setEditingAddress({ ...editingAddress!, email: e.target.value })}
            />
          </div>
          <div className="space-y-2 col-span-full">
            <Label htmlFor="address_type">Address Type</Label>
            <Select
              value={editingAddress?.address_type || ""}
              onValueChange={(value: "shipping" | "return" | "both" | "billing") =>
                setEditingAddress({ ...editingAddress!, address_type: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="return">Return</SelectItem>
                <SelectItem value="both">Both Shipping & Return</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-full">
            <Label htmlFor="type">Location Type</Label>
            <Select
              value={editingAddress?.type || ""}
              onValueChange={(value: "residential" | "commercial") =>
                setEditingAddress({ ...editingAddress!, type: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-full flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setEditingAddress(null)}>
              Cancel
            </Button>
            <Button type="submit">Save Address</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  const renderAddressCard = (address: AddressNew) => (
    <Card key={address.id} className="relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold text-lg">{address.name}</p>
            <p className="text-sm text-muted-foreground">{address.recipient}</p>
            {address.company && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" /> {address.company}
              </p>
            )}
            <p className="text-sm flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {address.address1}
            </p>
            {address.address2 && <p className="text-sm ml-4">{address.address2}</p>}
            <p className="text-sm ml-4">
              {address.city}, {address.state} {address.postal_code}
            </p>
            <p className="text-sm ml-4">{address.country}</p>
            {address.phone && (
              <p className="text-sm flex items-center gap-1">
                <Phone className="h-3 w-3" /> {address.phone}
              </p>
            )}
            {address.email && (
              <p className="text-sm flex items-center gap-1">
                <Mail className="h-3 w-3" /> {address.email}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setEditingAddress(address)
                  setIsAddingNew(false)
                }}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDeleteAddress(address.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
            <div className="flex flex-col items-end gap-1">
              {address.is_default && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Default
                </span>
              )}
              <span className="text-xs text-muted-foreground capitalize">{address.address_type}</span>
              <span className="text-xs text-muted-foreground capitalize">{address.type}</span>
            </div>
          </div>
        </div>
        {!address.is_default && (
          <div className="mt-3 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleSetDefault(address.id, address.address_type as "shipping" | "return" | "billing")}
            >
              Set as Default
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const shippingAddresses = addresses.filter((addr) => addr.address_type === "shipping" || addr.address_type === "both")
  const returnAddresses = addresses.filter((addr) => addr.address_type === "return" || addr.address_type === "both")
  const billingAddresses = addresses.filter((addr) => addr.address_type === "billing")

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setIsAddingNew(true)
            setEditingAddress({
              id: "",
              user_id: "mock_user_1",
              name: "",
              recipient: "",
              address1: "",
              city: "",
              state: "",
              postal_code: "",
              country: "",
              address_type: "shipping",
              type: "residential",
              is_default: false,
              created_at: "",
            })
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {editingAddress ? (
        renderAddressForm()
      ) : (
        <Tabs defaultValue="shipping">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="return">Return</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="shipping" className="mt-4 space-y-4">
            {shippingAddresses.length > 0 ? (
              shippingAddresses.map(renderAddressCard)
            ) : (
              <div className="text-center py-8 text-muted-foreground">No shipping addresses found.</div>
            )}
          </TabsContent>
          <TabsContent value="return" className="mt-4 space-y-4">
            {returnAddresses.length > 0 ? (
              returnAddresses.map(renderAddressCard)
            ) : (
              <div className="text-center py-8 text-muted-foreground">No return addresses found.</div>
            )}
          </TabsContent>
          <TabsContent value="billing" className="mt-4 space-y-4">
            {billingAddresses.length > 0 ? (
              billingAddresses.map(renderAddressCard)
            ) : (
              <div className="text-center py-8 text-muted-foreground">No billing addresses found.</div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// AddressDataTable component
function AddressDataTable({
  addresses,
  isLoading,
  error,
  activeTab,
  searchQuery,
  handleSearch,
  clearSearch,
  selectedAddresses,
  toggleAddressSelection,
  toggleSelectAll,
  isAllSelected,
  getSelectedAddressCount,
  setIsDeleteSelectedDialogOpen,
  setIsDeleteAllDialogOpen,
  exportAddressesToCSV,
  isExporting,
  sortField,
  sortDirection,
  toggleSort,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalPages,
  paginatedAddresses,
  openEditDialog,
  openDeleteDialog,
  handleCopyAddress,
  filterResidential,
  setFilterResidential,
  filterDefault,
  setFilterDefault,
  resetFilters,
  resetForm,
  setFormData,
  showMobileFilters,
  setShowMobileFilters,
}: {
  addresses: Address[]
  isLoading: boolean
  error: string | null
  activeTab: "shipping" | "billing"
  searchQuery: string
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearSearch: () => void
  selectedAddresses: Record<string, boolean>
  toggleAddressSelection: (id: string) => void
  toggleSelectAll: () => void
  isAllSelected: boolean
  getSelectedAddressCount: () => number
  setIsDeleteSelectedDialogOpen: (open: boolean) => void
  setIsDeleteAllDialogOpen: (open: boolean) => void
  exportAddressesToCSV: () => void
  isExporting: boolean
  sortField: SortField
  sortDirection: SortDirection
  toggleSort: (field: SortField) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
  setItemsPerPage: (items: number) => void
  totalPages: number
  paginatedAddresses: Address[]
  openEditDialog: (address: Address) => void
  openDeleteDialog: (address: Address) => void
  handleCopyAddress: (address: Address) => void
  filterResidential: boolean | null
  setFilterResidential: (value: boolean | null) => void
  filterDefault: boolean | null
  setFilterDefault: (value: boolean | null) => void
  resetFilters: () => void
  resetForm: () => void
  setFormData: React.Dispatch<React.SetStateAction<AddressFormData>>
  showMobileFilters: boolean
  setShowMobileFilters: (show: boolean) => void
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-navy" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
        <div className="text-sm text-red-800">{error}</div>
      </div>
    )
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">No {activeTab} addresses yet</h3>
        <p className="mt-1 text-gray-500">Add a {activeTab} address to get started</p>
        <Button
          variant="outline"
          className="mt-4 bg-transparent"
          onClick={() => {
            resetForm()
            setFormData((prev) => ({ ...prev, address_type: activeTab }))
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add {activeTab === "shipping" ? "Shipping" : "Billing"} Address
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile-first Toolbar */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search addresses..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-8 w-full"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden w-full"
          >
            <Filter className="mr-1 h-4 w-4" />
            Filters
            {(filterResidential !== null || filterDefault !== null) && (
              <Badge variant="secondary" className="ml-1">
                {(filterResidential !== null ? 1 : 0) + (filterDefault !== null ? 1 : 0)}
              </Badge>
            )}
            {showMobileFilters ? <EyeOff className="ml-1 h-4 w-4" /> : <Eye className="ml-1 h-4 w-4" />}
          </Button>

          <div className="hidden sm:flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="whitespace-nowrap bg-transparent">
                  <Filter className="mr-1 h-4 w-4" />
                  Filters
                  {(filterResidential !== null || filterDefault !== null) && (
                    <Badge variant="secondary" className="ml-1">
                      {(filterResidential !== null ? 1 : 0) + (filterDefault !== null ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <div className="font-medium mb-2">Address Type</div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="residential-all"
                        checked={filterResidential === null}
                        onChange={() => setFilterResidential(null)}
                        className="mr-2"
                      />
                      <label htmlFor="residential-all" className="text-sm">
                        All
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="residential-yes"
                        checked={filterResidential === true}
                        onChange={() => setFilterResidential(true)}
                        className="mr-2"
                      />
                      <label htmlFor="residential-yes" className="text-sm">
                        Residential
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="residential-no"
                        checked={filterResidential === false}
                        onChange={() => setFilterResidential(false)}
                        className="mr-2"
                      />
                      <label htmlFor="residential-no" className="text-sm">
                        Commercial
                      </label>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <div className="font-medium mb-2">Default Status</div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="default-all"
                        checked={filterDefault === null}
                        onChange={() => setFilterDefault(null)}
                        className="mr-2"
                      />
                      <label htmlFor="default-all" className="text-sm">
                        All
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="default-yes"
                        checked={filterDefault === true}
                        onChange={() => setFilterDefault(true)}
                        className="mr-2"
                      />
                      <label htmlFor="default-yes" className="text-sm">
                        Default
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="default-no"
                        checked={filterDefault === false}
                        onChange={() => setFilterDefault(false)}
                        className="mr-2"
                      />
                      <label htmlFor="default-no" className="text-sm">
                        Not Default
                      </label>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={exportAddressesToCSV}
              disabled={isExporting || addresses.length === 0}
              className="flex-1 sm:flex-none whitespace-nowrap bg-transparent"
            >
              {isExporting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Download className="mr-1 h-4 w-4" />}
              Export
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteAllDialogOpen(true)}
              disabled={addresses.length === 0}
              className="flex-1 sm:flex-none whitespace-nowrap"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete All
            </Button>
          </div>
        </div>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="sm:hidden p-4 border rounded-lg bg-gray-50 space-y-4">
            <div>
              <div className="font-medium mb-2">Address Type</div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="mobile-residential-all"
                    checked={filterResidential === null}
                    onChange={() => setFilterResidential(null)}
                    className="mr-2"
                  />
                  <label htmlFor="mobile-residential-all" className="text-sm">
                    All
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="mobile-residential-yes"
                    checked={filterResidential === true}
                    onChange={() => setFilterResidential(true)}
                    className="mr-2"
                  />
                  <label htmlFor="mobile-residential-yes" className="text-sm">
                    Residential
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="mobile-residential-no"
                    checked={filterResidential === false}
                    onChange={() => setFilterResidential(false)}
                    className="mr-2"
                  />
                  <label htmlFor="mobile-residential-no" className="text-sm">
                    Commercial
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Default Status</div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="mobile-default-all"
                    checked={filterDefault === null}
                    onChange={() => setFilterDefault(null)}
                    className="mr-2"
                  />
                  <label htmlFor="mobile-default-all" className="text-sm">
                    All
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="mobile-default-yes"
                    checked={filterDefault === true}
                    onChange={() => setFilterDefault(true)}
                    className="mr-2"
                  />
                  <label htmlFor="mobile-default-yes" className="text-sm">
                    Default
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="mobile-default-no"
                    checked={filterDefault === false}
                    onChange={() => setFilterDefault(false)}
                    className="mr-2"
                  />
                  <label htmlFor="mobile-default-no" className="text-sm">
                    Not Default
                  </label>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Data Table - Desktop */}
      <div className="hidden lg:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                  />
                </div>
              </TableHead>
              <TableHead className="min-w-[150px]">
                <button className="flex items-center gap-1" onClick={() => toggleSort("name")}>
                  Name
                  {sortField === "name" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  )}
                </button>
              </TableHead>
              <TableHead className="min-w-[150px]">
                <button className="flex items-center gap-1" onClick={() => toggleSort("company_name")}>
                  Company
                  {sortField === "company_name" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  )}
                </button>
              </TableHead>
              <TableHead className="min-w-[200px]">
                <button className="flex items-center gap-1" onClick={() => toggleSort("address_line1")}>
                  Address
                  {sortField === "address_line1" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  )}
                </button>
              </TableHead>
              <TableHead className="min-w-[120px]">
                <button className="flex items-center gap-1" onClick={() => toggleSort("city")}>
                  City
                  {sortField === "city" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  )}
                </button>
              </TableHead>
              <TableHead className="min-w-[80px]">
                <button className="flex items-center gap-1" onClick={() => toggleSort("state")}>
                  State
                  {sortField === "state" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  )}
                </button>
              </TableHead>
              <TableHead className="min-w-[100px]">
                <button className="flex items-center gap-1" onClick={() => toggleSort("postal_code")}>
                  ZIP Code
                  {sortField === "postal_code" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  )}
                </button>
              </TableHead>
              <TableHead className="min-w-[100px]">
                <button className="flex items-center gap-1" onClick={() => toggleSort("is_residential")}>
                  Type
                  {sortField === "is_residential" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  )}
                </button>
              </TableHead>
              <TableHead className="min-w-[80px]">
                <button className="flex items-center gap-1" onClick={() => toggleSort("is_default")}>
                  Default
                  {sortField === "is_default" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  )}
                </button>
              </TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAddresses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No addresses found. Try adjusting your filters or search query.
                </TableCell>
              </TableRow>
            ) : (
              paginatedAddresses.map((address) => (
                <TableRow key={address.id} className={selectedAddresses[address.id] ? "bg-blue-50" : ""}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={!!selectedAddresses[address.id]}
                        onChange={() => toggleAddressSelection(address.id)}
                        className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{address.name}</TableCell>
                  <TableCell>{address.company_name || "-"}</TableCell>
                  <TableCell>
                    <div>
                      {address.address_line1}
                      {address.address_line2 && <div className="text-gray-500 text-xs">{address.address_line2}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{address.city}</TableCell>
                  <TableCell>{address.state}</TableCell>
                  <TableCell>{address.postal_code}</TableCell>
                  <TableCell>
                    {address.is_residential ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Residential
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        Commercial
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {address.is_default ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Default
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(address)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleCopyAddress(address)}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => openDeleteDialog(address)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {paginatedAddresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No addresses found. Try adjusting your filters or search query.
          </div>
        ) : (
          paginatedAddresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 border rounded-lg ${selectedAddresses[address.id] ? "bg-blue-50 border-blue-200" : "bg-white"}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={!!selectedAddresses[address.id]}
                    onChange={() => toggleAddressSelection(address.id)}
                    className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy mt-1"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{address.name}</h3>
                    {address.company_name && <p className="text-sm text-gray-600">{address.company_name}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(address)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyAddress(address)}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => openDeleteDialog(address)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p>
                  {address.city}, {address.state} {address.postal_code}
                </p>
                <p>{address.country}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {address.is_residential ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Residential
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    Commercial
                  </Badge>
                )}
                {address.is_default && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Default
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
          <span>
            Showing {paginatedAddresses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, addresses.length)} of {addresses.length} addresses
          </span>
          <div className="flex items-center gap-2">
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span>per page</span>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(pageNum)}
                    className="h-8 w-8"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        )}
      </div>

      {getSelectedAddressCount() > 0 && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col sm:flex-row items-center gap-4 z-50">
          <span className="text-sm font-medium">
            {getSelectedAddressCount()} address{getSelectedAddressCount() > 1 ? "es" : ""} selected
          </span>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteSelectedDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  )
}
