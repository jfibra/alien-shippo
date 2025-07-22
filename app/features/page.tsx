import Link from "next/link"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle,
  Package,
  Globe,
  ShieldCheck,
  Truck,
  DollarSign,
  BarChart,
  Settings,
  Mail,
  Clock,
  FileText,
  MapPin,
  CreditCard,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Features | AlienShipper - Free Alien Shipping Software",
  description:
    "Explore AlienShipper's powerful features: discounted USPS & UPS rates, batch label creation, international shipping, tracking, insurance, and more. All free!",
  keywords: [
    "shipping software features",
    "batch label printing",
    "international shipping solutions",
    "shipping tracking",
    "shipping insurance",
    "address validation",
    "shipping cost analysis",
    "free shipping tools",
    "e-commerce shipping",
  ],
  openGraph: {
    title: "AlienShipper Features | Powerful & Free Shipping Tools",
    description:
      "Discover how AlienShipper's features can streamline your shipping, save you money, and simplify your operations.",
    url: "https://alienshipper.com/features",
  },
  twitter: {
    title: "AlienShipper Features | Free Shipping Software",
    description: "Streamline your shipping with AlienShipper's comprehensive and free features.",
  },
  alternates: {
    canonical: "https://alienshipper.com/features",
  },
}

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Package,
      title: "Batch Label Creation",
      description:
        "Generate hundreds of shipping labels simultaneously, saving valuable time for high-volume shippers.",
    },
    {
      icon: Globe,
      title: "International Shipping",
      description: "Simplify global logistics with automated customs forms and international documentation.",
    },
    {
      icon: ShieldCheck,
      title: "Shipping Insurance",
      description: "Protect your valuable goods with affordable, comprehensive insurance options for every shipment.",
    },
    {
      icon: Truck,
      title: "Real-Time Tracking",
      description: "Provide customers with up-to-the-minute tracking updates and automated delivery notifications.",
    },
    {
      icon: MapPin,
      title: "Address Validation",
      description: "Minimize delivery errors and avoid surcharges with instant, accurate address verification.",
    },
    {
      icon: DollarSign,
      title: "Discounted Rates",
      description: "Access exclusive, alien-negotiated USPS® and UPS® rates, saving up to 89% on postage.",
    },
  ]

  const additionalFeatures = [
    {
      icon: BarChart,
      title: "Detailed Reporting & Analytics",
      description: "Gain insights into your shipping spend, performance, and trends with comprehensive reports.",
    },
    {
      icon: Settings,
      title: "Customizable Preferences",
      description: "Tailor your shipping settings, default package types, and notification preferences to your needs.",
    },
    {
      icon: Mail,
      title: "Automated Email Notifications",
      description: "Send branded shipping updates to your customers automatically, enhancing their experience.",
    },
    {
      icon: Clock,
      title: "Scheduled Pickups",
      description: "Arrange carrier pickups directly from the platform for convenience and efficiency.",
    },
    {
      icon: FileText,
      title: "Print Packing Slips",
      description: "Generate and print professional packing slips alongside your shipping labels.",
    },
    {
      icon: CreditCard,
      title: "Flexible Payment Options",
      description: "Fund your account with various payment methods, including credit card and PayPal.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-navy text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Unleash the Power of Alien Shipping</h1>
            <p className="text-xl text-stone-300 max-w-3xl mx-auto">
              AlienShipper is packed with features designed to streamline your shipping process, save you money, and
              provide an out-of-this-world experience.
            </p>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-6">Core Alien Capabilities</h2>
              <p className="text-lg text-gray-600">
                These are the essential tools that make AlienShipper your go-to solution for efficient and affordable
                shipping.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainFeatures.map((feature, index) => (
                <Card key={index} className="p-6 text-left">
                  <CardHeader className="p-0 mb-4">
                    <feature.icon className="h-8 w-8 text-gold" />
                    <CardTitle className="mt-4 text-xl font-semibold text-navy">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 text-gray-600">{feature.description}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-24 bg-stone">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-6">More Alien Benefits</h2>
              <p className="text-lg text-gray-600">
                Beyond the core, AlienShipper offers a suite of additional features to enhance your shipping workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {additionalFeatures.map((feature, index) => (
                <Card key={index} className="p-6 text-left">
                  <CardHeader className="p-0 mb-4">
                    <feature.icon className="h-8 w-8 text-gold" />
                    <CardTitle className="mt-4 text-xl font-semibold text-navy">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 text-gray-600">{feature.description}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison / CTA */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Why Choose AlienShipper?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              We offer unparalleled savings and features, all without the typical fees.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-stone p-8 rounded-lg shadow-sm text-left">
                <h3 className="text-2xl font-bold text-navy mb-4">AlienShipper</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gold mr-2 shrink-0" />
                    <span>Up to 89% off USPS® & UPS® rates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gold mr-2 shrink-0" />
                    <span>No monthly fees, no markups</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gold mr-2 shrink-0" />
                    <span>Unlimited labels & users</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gold mr-2 shrink-0" />
                    <span>Comprehensive feature set</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-100 p-8 rounded-lg shadow-sm text-left">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Other Shipping Software</h3>
                <ul className="space-y-3 text-gray-500">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                    <span>Often higher rates or limited discounts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                    <span>Monthly subscription fees</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                    <span>Per-label fees or user limits</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                    <span>Basic features on free plans</span>
                  </li>
                </ul>
              </div>
            </div>
            <Button variant="gold" size="lg" asChild className="mt-12">
              <Link href="/signup">Start Saving Today</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
