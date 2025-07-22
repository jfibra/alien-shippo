"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Package, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { ShippingRate } from "@/lib/types" // Import the type

export function ShippingCalculator() {
  const [fromZip, setFromZip] = useState("")
  const [toZip, setToZip] = useState("")
  const [weight, setWeight] = useState("")
  const [packageType, setPackageType] = useState("parcel")
  const [dimensions, setDimensions] = useState({ length: "", width: "", height: "" })
  const [rates, setRates] = useState<ShippingRate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dataSource, setDataSource] = useState<string>("")

  const validateZipCode = (zip: string) => {
    return /^\d{5}(-\d{4})?$/.test(zip.trim())
  }

  const calculateRates = async () => {
    // Validation
    if (!fromZip || !toZip || !weight || !packageType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!validateZipCode(fromZip)) {
      toast({
        title: "Invalid ZIP Code",
        description: "Please enter a valid 'From' ZIP code (e.g., 90210)",
        variant: "destructive",
      })
      return
    }

    if (!validateZipCode(toZip)) {
      toast({
        title: "Invalid ZIP Code",
        description: "Please enter a valid 'To' ZIP code (e.g., 10001)",
        variant: "destructive",
      })
      return
    }

    const weightNum = Number.parseFloat(weight)
    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 150) {
      toast({
        title: "Invalid Weight",
        description: "Please enter a valid weight between 0.1 and 150 lbs",
        variant: "destructive",
      })
      return
    }

    // Validate custom dimensions if needed
    if (packageType === "custom") {
      const length = Number.parseFloat(dimensions.length)
      const width = Number.parseFloat(dimensions.width)
      const height = Number.parseFloat(dimensions.height)

      if (
        isNaN(length) ||
        isNaN(width) ||
        isNaN(height) ||
        length <= 0 ||
        width <= 0 ||
        height <= 0 ||
        length > 108 ||
        width > 108 ||
        height > 108
      ) {
        toast({
          title: "Invalid Dimensions",
          description: "Please enter valid dimensions between 0.1 and 108 inches",
          variant: "destructive",
        })
        return
      }
    }

    setLoading(true)
    setError("")
    setRates([])
    setDataSource("")

    try {
      const requestBody = {
        fromZip: fromZip.trim(),
        toZip: toZip.trim(),
        weight: weight,
        packageType: packageType,
        ...(packageType === "custom" && {
          length: dimensions.length || "12",
          width: dimensions.width || "8",
          height: dimensions.height || "6",
        }),
      }

      console.log("Sending request:", requestBody)

      const response = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setRates(data.rates || [])
      setDataSource(data.source || "unknown")

      if (!data.rates || data.rates.length === 0) {
        setError("No shipping rates available for this route. Please check your ZIP codes and try again.")
      } else {
        toast({
          title: "Rates Updated",
          description: `Found ${data.rates.length} shipping options from ${data.source === "shippo" ? "Shippo" : "carrier APIs"}`,
        })
      }
    } catch (err) {
      console.error("Error calculating rates:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to calculate shipping rates"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const packageTypes = [
    { value: "parcel", label: "Parcel" },
    { value: "letter", label: "Letter" },
    { value: "flat", label: "Flat" },
    { value: "small_flat_rate_box", label: "USPS Small Flat Rate Box" },
    { value: "medium_flat_rate_box", label: "USPS Medium Flat Rate Box" },
    { value: "large_flat_rate_box", label: "USPS Large Flat Rate Box" },
    { value: "regional_a", label: "USPS Regional Rate Box A" },
    { value: "regional_b", label: "USPS Regional Rate Box B" },
    { value: "ups_small_box", label: "UPS Small Box" },
    { value: "ups_medium_box", label: "UPS Medium Box" },
    { value: "ups_large_box", label: "UPS Large Box" },
    { value: "custom", label: "Custom Dimensions" },
  ]

  const getCarrierLogo = (carrier: string) => {
    switch (carrier.toUpperCase()) {
      case "USPS":
        return (
          <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">USPS</span>
          </div>
        )
      case "UPS":
        return (
          <div className="w-12 h-12 bg-yellow-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">UPS</span>
          </div>
        )
      case "FEDEX":
        return (
          <div className="w-12 h-12 bg-purple-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">FedEx</span>
          </div>
        )
      default:
        return (
          <div className="w-12 h-12 bg-gray-400 rounded flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
        )
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
          <Calculator className="h-5 w-5 sm:h-6 sm:w-6" />
          Real-Time Shipping Rate Calculator
          {dataSource === "shippo" && <CheckCircle className="h-4 w-4 text-green-600" title="Live data from Shippo" />}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Get instant quotes from USPS, UPS, and FedEx with live carrier rates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="from-zip" className="text-sm">
              From ZIP Code *
            </Label>
            <Input
              id="from-zip"
              placeholder="90210"
              value={fromZip}
              onChange={(e) => setFromZip(e.target.value)}
              className="text-sm"
              maxLength={10}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to-zip" className="text-sm">
              To ZIP Code *
            </Label>
            <Input
              id="to-zip"
              placeholder="10001"
              value={toZip}
              onChange={(e) => setToZip(e.target.value)}
              className="text-sm"
              maxLength={10}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm">
              Weight (lbs) *
            </Label>
            <Input
              id="weight"
              placeholder="2.5"
              type="number"
              step="0.1"
              min="0.1"
              max="150"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="package-type" className="text-sm">
              Package Type *
            </Label>
            <Select value={packageType} onValueChange={setPackageType}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select package type" />
              </SelectTrigger>
              <SelectContent>
                {packageTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-sm">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {packageType === "custom" && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="length" className="text-sm">
                Length (in) *
              </Label>
              <Input
                id="length"
                placeholder="12"
                type="number"
                step="0.1"
                min="0.1"
                max="108"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width" className="text-sm">
                Width (in) *
              </Label>
              <Input
                id="width"
                placeholder="8"
                type="number"
                step="0.1"
                min="0.1"
                max="108"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm">
                Height (in) *
              </Label>
              <Input
                id="height"
                placeholder="6"
                type="number"
                step="0.1"
                min="0.1"
                max="108"
                value={dimensions.height}
                onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>
        )}

        <Button
          onClick={calculateRates}
          className="w-full"
          size="lg"
          disabled={loading || !fromZip || !toZip || !weight || !packageType}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Live Rates...
            </>
          ) : (
            "Get Real-Time Rates"
          )}
        </Button>

        {error && (
          <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {rates.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold">Live Shipping Rates</h3>
              {dataSource === "shippo" && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  Live from Shippo
                </div>
              )}
            </div>
            <div className="grid gap-2 sm:gap-3">
              {rates.map((rate, index) => {
                // Calculate estimated retail price and savings
                const retailMultiplier = rate.carrier === "USPS" ? 1.4 : 1.3
                const retailPrice = rate.rate * retailMultiplier
                const savings = Math.round(((retailPrice - rate.rate) / retailPrice) * 100)

                return (
                  <div
                    key={rate.id || index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg space-y-2 sm:space-y-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getCarrierLogo(rate.carrier)}
                      <div className="min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">
                          {rate.carrier} {rate.service}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          Retail: ${retailPrice.toFixed(2)} • Save {savings}%
                          {rate.estimated_days && ` • ${rate.estimated_days} business days`}
                          {rate.duration_terms && ` • ${rate.duration_terms}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-lg sm:text-xl font-bold text-green-600">${rate.rate.toFixed(2)}</div>
                      <div className="text-xs sm:text-sm text-gray-500">Viking Rate</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="text-xs text-gray-500 text-center">
              Rates updated in real-time from carrier APIs via Shippo
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
