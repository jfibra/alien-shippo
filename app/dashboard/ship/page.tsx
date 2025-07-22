"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"
import { getAllAddresses } from "@/lib/address-service"
import { ShippingCalculator } from "@/components/shipping-calculator"

type ShippingRate = {
  id: string
  service: string
  carrier: string
  rate: number
  delivery_days: number | null
  estimated_days: number | null
  duration_terms: string | null
}

type Address = {
  id: string
  name: string
  company_name: string | null
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  is_residential: boolean
  address_type: string
  email: string | null
}

export default function ShipPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingRates, setLoadingRates] = useState(false)
  const [addresses, setAddresses] = useState<{ shipping: Address[]; return: Address[] }>({ shipping: [], return: [] })
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null)
  const [rates, setRates] = useState<ShippingRate[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [userBalance, setUserBalance] = useState<number | null>(null)

  // Track if address fields have been modified
  const [fromAddressModified, setFromAddressModified] = useState(false)
  const [toAddressModified, setToAddressModified] = useState(false)

  const [formData, setFormData] = useState({
    // From address
    fromAddressId: "new",
    fromName: "",
    fromCompany: "",
    fromStreet1: "",
    fromStreet2: "",
    fromCity: "",
    fromState: "",
    fromZip: "",
    fromCountry: "US",
    fromPhone: "",
    fromEmail: "",
    saveFromAddress: false,

    // To address
    toAddressId: "new",
    toName: "",
    toCompany: "",
    toStreet1: "",
    toStreet2: "",
    toCity: "",
    toState: "",
    toZip: "",
    toCountry: "US",
    toPhone: "",
    toEmail: "",
    saveToAddress: false,

    // Package details
    packageType: "parcel",
    weightLb: "0",
    weightOz: "0",
    length: "",
    width: "",
    height: "",
    nonMachinable: false,

    // Contents
    contents: "merchandise",
    customsValue: "",
    insurance: "none",
    requireSignature: false,
  })

  // Fetch saved addresses and user balance
  useEffect(() => {
    async function loadAddresses() {
      setIsLoadingAddresses(true)
      try {
        const result = await getAllAddresses()

        // Debug logging
        console.log("Loaded ALL addresses result:", result)

        if (result.error) {
          console.error("Error fetching addresses:", result.error)
          toast({
            title: "Error",
            description: "Failed to load saved addresses. " + result.error,
            variant: "destructive",
          })
        } else {
          // Set all addresses for both shipping and return
          setAddresses({
            shipping: result.addresses || [],
            return: result.addresses || [],
          })
        }
      } catch (error) {
        console.error("Error in loadAddresses:", error)
        toast({
          title: "Error",
          description: "Failed to load saved addresses.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingAddresses(false)
      }
    }

    async function loadUserBalance() {
      try {
        const { data, error } = await supabase.from("user_accounts").select("balance").single()

        if (error) {
          console.error("Error fetching user balance:", error)
        } else if (data) {
          setUserBalance(data.balance || 0)
        }
      } catch (error) {
        console.error("Error loading user balance:", error)
      }
    }

    loadAddresses()
    loadUserBalance()
  }, [supabase])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))

    // Track if address fields have been modified
    if (name.startsWith("from") && name !== "fromAddressId" && name !== "saveFromAddress") {
      setFromAddressModified(true)
    } else if (name.startsWith("to") && name !== "toAddressId" && name !== "saveToAddress") {
      setToAddressModified(true)
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // If selecting a saved address, populate the form fields
    if (name === "fromAddressId") {
      // Reset modification flag when selecting a new address
      setFromAddressModified(false)

      if (value !== "new") {
        const selectedAddress = [...addresses.shipping, ...addresses.return].find((addr) => addr.id === value)
        if (selectedAddress) {
          setFormData((prev) => ({
            ...prev,
            fromName: selectedAddress.name,
            fromCompany: selectedAddress.company_name || "",
            fromStreet1: selectedAddress.address_line1,
            fromStreet2: selectedAddress.address_line2 || "",
            fromCity: selectedAddress.city,
            fromState: selectedAddress.state,
            fromZip: selectedAddress.postal_code,
            fromCountry: selectedAddress.country,
            fromEmail: selectedAddress.email || "",
          }))
        }
      } else {
        // Clear form fields when selecting "new"
        setFormData((prev) => ({
          ...prev,
          fromName: "",
          fromCompany: "",
          fromStreet1: "",
          fromStreet2: "",
          fromCity: "",
          fromState: "",
          fromZip: "",
          fromCountry: "US",
          fromEmail: "",
        }))
      }
    }

    if (name === "toAddressId") {
      // Reset modification flag when selecting a new address
      setToAddressModified(false)

      if (value !== "new") {
        const selectedAddress = [...addresses.shipping, ...addresses.return].find((addr) => addr.id === value)
        if (selectedAddress) {
          setFormData((prev) => ({
            ...prev,
            toName: selectedAddress.name,
            toCompany: selectedAddress.company_name || "",
            toStreet1: selectedAddress.address_line1,
            toStreet2: selectedAddress.address_line2 || "",
            toCity: selectedAddress.city,
            toState: selectedAddress.state,
            toZip: selectedAddress.postal_code,
            toCountry: selectedAddress.country,
            toEmail: selectedAddress.email || "",
          }))
        }
      } else {
        // Clear form fields when selecting "new"
        setFormData((prev) => ({
          ...prev,
          toName: "",
          toCompany: "",
          toStreet1: "",
          toStreet2: "",
          toCity: "",
          toState: "",
          toZip: "",
          toCountry: "US",
          toEmail: "",
        }))
      }
    }
  }

  // Get shipping rates
  const getShippingRates = async () => {
    setLoadingRates(true)
    setRates([])

    try {
      // Calculate total weight in pounds
      const weightLb = Number.parseFloat(formData.weightLb) || 0
      const weightOz = Number.parseFloat(formData.weightOz) || 0
      const totalWeight = weightLb + weightOz / 16

      // Create request object for Shippo API
      const rateData = {
        packageType: formData.packageType,
        weight: totalWeight.toString(),
        fromZip: formData.fromZip,
        toZip: formData.toZip,
        length: formData.length,
        width: formData.width,
        height: formData.height,
      }

      console.log("Requesting live shipping rates from Shippo:", rateData)

      const response = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rateData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response from Shippo API:", errorText)

        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.error || "Failed to get live shipping rates")
        } catch (parseError) {
          throw new Error(`Failed to get shipping rates: ${errorText.substring(0, 100)}...`)
        }
      }

      const data = await response.json()
      console.log(`Received ${data.rates?.length || 0} live shipping rates from Shippo`)

      if (data.rates && data.rates.length > 0) {
        // Sort rates by price (lowest first)
        const sortedRates = [...data.rates].sort((a, b) => a.rate - b.rate)
        setRates(sortedRates)
        setSelectedRate(sortedRates[0]) // Select the first rate by default

        toast({
          title: "Live Rates Loaded",
          description: `Found ${sortedRates.length} shipping options from live carrier APIs`,
        })
      } else {
        toast({
          title: "No rates available",
          description: "No shipping rates were found for the provided details. Please check your inputs and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error getting live shipping rates:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get live shipping rates",
        variant: "destructive",
      })
    } finally {
      setLoadingRates(false)
    }
  }

  // Handle rate selection
  const handleRateSelect = (rate: ShippingRate) => {
    setSelectedRate(rate)
  }

  // Handle form submission for creating a shipment
  const handleCreateShipment = async () => {
    if (!selectedRate) {
      toast({
        title: "No rate selected",
        description: "Please select a shipping rate to continue.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare shipment data
      const shipmentData = {
        // From address
        fromAddressId: formData.fromAddressId,
        fromName: formData.fromName,
        fromCompany: formData.fromCompany,
        fromStreet1: formData.fromStreet1,
        fromStreet2: formData.fromStreet2,
        fromCity: formData.fromCity,
        fromState: formData.fromState,
        fromZip: formData.fromZip,
        fromCountry: formData.fromCountry,
        fromPhone: formData.fromPhone,
        fromEmail: formData.fromEmail,
        // Only save if it's a new address or if the user modified an existing address
        saveFromAddress:
          formData.fromAddressId === "new" ? formData.saveFromAddress : formData.saveFromAddress && fromAddressModified,

        // To address
        toAddressId: formData.toAddressId,
        toName: formData.toName,
        toCompany: formData.toCompany,
        toStreet1: formData.toStreet1,
        toStreet2: formData.toStreet2,
        toCity: formData.toCity,
        toState: formData.toState,
        toZip: formData.toZip,
        toCountry: formData.toCountry,
        toPhone: formData.toPhone,
        toEmail: formData.toEmail,
        // Only save if it's a new address or if the user modified an existing address
        saveToAddress:
          formData.toAddressId === "new" ? formData.saveToAddress : formData.saveToAddress && toAddressModified,

        // Package details
        packageType: formData.packageType,
        weightLb: Number.parseFloat(formData.weightLb) || 0,
        weightOz: Number.parseFloat(formData.weightOz) || 0,
        length: formData.length ? Number.parseFloat(formData.length) : null,
        width: formData.width ? Number.parseFloat(formData.width) : null,
        height: formData.height ? Number.parseFloat(formData.height) : null,
        nonMachinable: formData.nonMachinable,

        // Contents
        contents: formData.contents,
        customsValue: formData.customsValue ? Number.parseFloat(formData.customsValue) : null,
        insurance: formData.insurance,
        requireSignature: formData.requireSignature,

        // Selected rate - don't pass the ID directly, it will be created on the server
        rateId: null, // Set to null to force creation of a new rate
        carrier: selectedRate.carrier,
        service: selectedRate.service,
        rate: selectedRate.rate,
        estimatedDays: selectedRate.estimated_days,
      }

      console.log("Sending shipment data:", shipmentData)

      const response = await fetch("/api/create-shipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipmentData),
      })

      const data = await response.json()

      if (!response.ok) {
        // Check if this is an insufficient balance error
        if (response.status === 400 && data.error === "Insufficient balance") {
          toast({
            title: "Insufficient Balance",
            description:
              data.message || "You don't have enough funds to create this shipment. Please add funds to your account.",
            variant: "destructive",
          })

          // Ask if they want to add funds
          const addFunds = confirm(`${data.message}\n\nWould you like to add funds to your account now?`)
          if (addFunds) {
            router.push("/dashboard/billing/add-funds")
          }
          return
        }

        throw new Error(data.error || "Failed to create shipment")
      }

      toast({
        title: "Shipment created",
        description: "Your shipment has been created successfully!",
      })

      // Redirect to the shipment details page
      router.push(`/dashboard/shipments/${data.shipmentId}`)
    } catch (error) {
      console.error("Error creating shipment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create shipment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Continue to next step
  const handleContinue = async () => {
    if (step === 2) {
      // Get shipping rates when moving from step 2 to 3
      await getShippingRates()
    }

    setStep(step + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">Create Shipment</h1>
        <p className="text-muted-foreground">Get shipping rates and create labels for your packages</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Calculator</CardTitle>
          <CardDescription>Enter your package details to get shipping rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ShippingCalculator />
        </CardContent>
      </Card>
    </div>
  )
}
