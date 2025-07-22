"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getShippingRates, createShipment } from "@/lib/actions/shipping-actions"
import { Loader2, ArrowRight, Check } from "lucide-react"

type Address = {
  id: string
  name: string
  address_line1: string
  city: string
  state: string
  postal_code: string
}

type Rate = {
  object_id: string
  provider: string
  servicelevel: { name: string; token: string }
  amount: string
  currency: string
  estimated_days: number
}

interface CreateShipmentClientProps {
  initialAddresses: Address[]
  userId: string
}

export function CreateShipmentClient({ initialAddresses, userId }: CreateShipmentClientProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    from_address_id: "",
    to_address_id: "",
    weight_oz: "",
    length: "",
    width: "",
    height: "",
  })
  const [rates, setRates] = useState<Rate[]>([])
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGetRates = () => {
    startTransition(async () => {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => form.append(key, value))

      const result = await getShippingRates(form)
      if (result.success) {
        setRates(result.rates)
        setStep(2)
        toast({ title: "Rates fetched successfully!" })
      } else {
        toast({ title: "Error fetching rates", description: result.error, variant: "destructive" })
      }
    })
  }

  const handleCreateShipment = () => {
    if (!selectedRate) {
      toast({ title: "Please select a rate", variant: "destructive" })
      return
    }
    startTransition(async () => {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => form.append(key, value))
      form.append("rate_id", selectedRate.object_id)
      form.append("carrier", selectedRate.provider)
      form.append("service", selectedRate.servicelevel.name)
      form.append("cost", selectedRate.amount)

      const result = await createShipment(form)
      if (result.success) {
        toast({ title: "Shipment created!", description: `Redirecting to shipment ${result.shipmentId}` })
        router.push(`/dashboard/shipments/${result.shipmentId}`)
      } else {
        toast({ title: "Error creating shipment", description: result.error, variant: "destructive" })
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Shipment</CardTitle>
        <CardDescription>
          Step {step} of 2: {step === 1 ? "Details & Rates" : "Select Rate & Purchase"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from_address_id">From Address</Label>
                <Select name="from_address_id" onValueChange={(v) => handleSelectChange("from_address_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an origin address" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialAddresses.map((addr) => (
                      <SelectItem key={addr.id} value={addr.id}>
                        {addr.name} - {addr.address_line1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="to_address_id">To Address</Label>
                <Select name="to_address_id" onValueChange={(v) => handleSelectChange("to_address_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a destination address" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialAddresses.map((addr) => (
                      <SelectItem key={addr.id} value={addr.id}>
                        {addr.name} - {addr.address_line1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Parcel Details</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                <Input name="weight_oz" placeholder="Weight (oz)" onChange={handleInputChange} />
                <Input name="length" placeholder="Length (in)" onChange={handleInputChange} />
                <Input name="width" placeholder="Width (in)" onChange={handleInputChange} />
                <Input name="height" placeholder="Height (in)" onChange={handleInputChange} />
              </div>
            </div>
            <Button onClick={handleGetRates} disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Get Rates"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Available Rates</h3>
            <div className="space-y-2">
              {rates.map((rate) => (
                <div
                  key={rate.object_id}
                  onClick={() => setSelectedRate(rate)}
                  className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer ${
                    selectedRate?.object_id === rate.object_id ? "border-blue-500 bg-blue-50" : ""
                  }`}
                >
                  <div>
                    <p className="font-bold">
                      {rate.provider} {rate.servicelevel.name}
                    </p>
                    <p className="text-sm text-gray-500">Est. {rate.estimated_days} days</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ${rate.amount} {rate.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleCreateShipment} disabled={isPending || !selectedRate}>
                {isPending ? <Loader2 className="animate-spin" /> : "Purchase Label"}
                <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
