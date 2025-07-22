import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Truck, Package, DollarSign, Globe, Shield } from "lucide-react"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "UPS Shipping - Viking Freight",
  description: "Ship with UPS through Viking Freight for reliable and discounted services.",
}

export default function UPSShippingPage() {
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
                Reliable UPS Shipping, Unbeatable Rates
              </h1>
              <p className="text-lg md:text-xl text-blue-100">
                Access discounted UPS rates and streamline your shipping process with Viking Freight.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row justify-center">
                <Button asChild size="lg" className="bg-gold text-white hover:bg-gold/90">
                  <Link href="/signup">Start Shipping UPS</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-blue-800 bg-transparent"
                >
                  <Link href="/pricing">Compare UPS Rates</Link>
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
                <Truck className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">All UPS Services</CardTitle>
                <CardDescription>
                  Access a full range of UPS services, from Ground to Express, all in one place.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6 shadow-lg">
                <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">Deep Discounts</CardTitle>
                <CardDescription>Save significantly on every UPS label compared to retail rates.</CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6 shadow-lg">
                <Package className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">Easy Label Creation</CardTitle>
                <CardDescription>Generate and print UPS shipping labels quickly and efficiently.</CardDescription>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Why Ship UPS with Viking Freight?
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-gold" />
                <h3 className="text-xl font-semibold">Seamless Integration</h3>
                <p className="text-gray-600">Connect your e-commerce platforms for automated shipping.</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-gold" />
                <h3 className="text-xl font-semibold">Real-Time Tracking</h3>
                <p className="text-gray-600">Monitor your UPS shipments with up-to-date tracking information.</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-gold" />
                <h3 className="text-xl font-semibold">Dedicated Support</h3>
                <p className="text-gray-600">Our team is here to help with any UPS shipping questions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* UPS Services */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-6">UPS® Services We Offer</h2>
              <p className="text-lg text-gray-600">
                Viking Freight provides access to all major UPS shipping services at discounted rates.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-stone rounded-xl p-8">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Truck className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">UPS® Ground</h3>
                <p className="text-gray-600 mb-4">
                  Cost-effective delivery for packages within the U.S. with day-definite delivery.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Up to 50% off retail rates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Delivery in 1-5 business days</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Free tracking included</span>
                  </li>
                </ul>
              </div>

              <div className="bg-stone rounded-xl p-8">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <CheckCircle2 className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">UPS® 2nd Day Air®</h3>
                <p className="text-gray-600 mb-4">Guaranteed delivery by the end of the second business day.</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Up to 67% off retail rates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Delivery by end of 2nd day</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Delivery time guarantee</span>
                  </li>
                </ul>
              </div>

              <div className="bg-stone rounded-xl p-8">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Package className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">UPS® Next Day Air®</h3>
                <p className="text-gray-600 mb-4">
                  Guaranteed overnight delivery by 10:30 a.m., 12:00 p.m., or end of day.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Up to 77% off retail rates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Next-day delivery</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Time-definite options</span>
                  </li>
                </ul>
              </div>

              <div className="bg-stone rounded-xl p-8">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Globe className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">UPS® Worldwide</h3>
                <p className="text-gray-600 mb-4">International shipping to over 220 countries and territories.</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Up to 65% off retail rates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Customs clearance included</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">End-to-end tracking</span>
                  </li>
                </ul>
              </div>

              <div className="bg-stone rounded-xl p-8">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Shield className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">UPS® SurePost®</h3>
                <p className="text-gray-600 mb-4">
                  Economical ground service for lightweight packages with final delivery by USPS.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Lowest UPS rates available</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Delivery in 2-7 business days</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Residential delivery included</span>
                  </li>
                </ul>
              </div>

              <div className="bg-stone rounded-xl p-8">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Truck className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">UPS® 3 Day Select®</h3>
                <p className="text-gray-600 mb-4">
                  Cost-effective option with guaranteed delivery within 3 business days.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Up to 55% off retail rates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Delivery by end of 3rd day</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Delivery time guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Ready to Optimize Your UPS Shipping?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Join Viking Freight and start saving on every UPS package.
            </p>
            <Button asChild size="lg" className="bg-gold text-white hover:bg-gold/90">
              <Link href="/signup">Sign Up for Free</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
