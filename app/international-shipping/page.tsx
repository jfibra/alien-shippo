import type { Metadata } from "next"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Globe, Package, DollarSign } from "lucide-react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "International Shipping - Viking Freight",
  description: "Simplify your international shipping with Viking Freight's reliable and affordable services.",
}

export default function InternationalShippingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden">
          <Image
            src="/interwoven-nordic-abstraction.png"
            alt="Abstract Nordic Pattern"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="absolute inset-0 z-0 opacity-20"
          />
          <div className="container relative z-10 px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Conquer Global Markets with Ease
              </h1>
              <p className="text-lg md:text-xl text-blue-100">
                Viking Freight makes international shipping simple, reliable, and affordable. Expand your reach without
                the hassle.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row justify-center">
                <Button asChild size="lg" className="bg-gold text-white hover:bg-gold/90">
                  <Link href="/signup">Get Started Today</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-blue-800 bg-transparent"
                >
                  <Link href="/pricing">View International Rates</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col items-center text-center p-6 shadow-lg">
                <Globe className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">Worldwide Coverage</CardTitle>
                <CardDescription>
                  Ship to over 220 countries and territories with our extensive network of carriers.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6 shadow-lg">
                <Package className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">Customs Made Easy</CardTitle>
                <CardDescription>
                  Automated customs forms and duty calculations to ensure smooth international transit.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6 shadow-lg">
                <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">Competitive Rates</CardTitle>
                <CardDescription>
                  Access discounted international shipping rates from top carriers, saving you money.
                </CardDescription>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              How International Shipping Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold">Prepare Your Shipment</h3>
                <p className="text-gray-600">
                  Enter package details, origin, and destination. Our system guides you through the process.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold">Generate Customs Forms</h3>
                <p className="text-gray-600">
                  We automatically generate all required customs documentation for your international package.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold">Print Label & Ship</h3>
                <p className="text-gray-600">
                  Print your discounted label and customs forms, then drop off your package.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-blue-900 text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Why Choose Viking Freight for International Shipping?
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-gold" />
                <h3 className="text-xl font-semibold">Reliability</h3>
                <p className="text-blue-100">Trusted carriers and consistent service.</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-gold" />
                <h3 className="text-xl font-semibold">Affordability</h3>
                <p className="text-blue-100">Deep discounts on international rates.</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-gold" />
                <h3 className="text-xl font-semibold">Simplicity</h3>
                <p className="text-blue-100">User-friendly platform and automated processes.</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-gold" />
                <h3 className="text-xl font-semibold">Support</h3>
                <p className="text-blue-100">Dedicated customer support for all your queries.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Ready to Ship Globally?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Join thousands of businesses expanding their reach with Viking Freight.
            </p>
            <Button asChild size="lg" className="bg-gold text-white hover:bg-gold/90">
              <Link href="/signup">Create Your Free Account</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
