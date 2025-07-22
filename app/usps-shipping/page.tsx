import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Clock, Globe, Shield, Truck, CheckCircle2, Mail, DollarSign } from "lucide-react"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "USPS Shipping - Viking Freight",
  description: "Ship with USPS through Viking Freight for reliable and discounted services.",
}

export default function USPSShippingPage() {
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
                Affordable USPS Shipping, Simplified
              </h1>
              <p className="text-lg md:text-xl text-blue-100">
                Get the best USPS rates and streamline your domestic and international mail with Viking Freight.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row justify-center">
                <Button asChild size="lg" className="bg-gold text-white hover:bg-gold/90">
                  <Link href="/signup">Start Shipping USPS</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-blue-800 bg-transparent"
                >
                  <Link href="/pricing">Compare USPS Rates</Link>
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
                <Mail className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">All USPS Services</CardTitle>
                <CardDescription>
                  Access First-Class, Priority Mail, Media Mail, and more, all in one platform.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6 shadow-lg">
                <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">Discounted Rates</CardTitle>
                <CardDescription>Save on every USPS label with our pre-negotiated commercial rates.</CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6 shadow-lg">
                <Package className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">Easy Label Creation</CardTitle>
                <CardDescription>
                  Generate and print USPS shipping labels quickly and efficiently from your dashboard.
                </CardDescription>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Why Ship USPS with Viking Freight?
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-gold" />
                <h3 className="text-xl font-semibold">Reliable Delivery</h3>
                <p className="text-gray-600">Leverage the extensive network of USPS for dependable delivery.</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-gold" />
                <h3 className="text-xl font-semibold">Cost-Effective</h3>
                <p className="text-gray-600">Ideal for small, lightweight packages and budget-conscious shipping.</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-gold" />
                <h3 className="text-xl font-semibold">Convenient Drop-off</h3>
                <p className="text-gray-600">Drop off packages at any USPS location or mailbox.</p>
              </div>
            </div>
          </div>
        </section>

        {/* USPS Services */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-6">USPS® Services We Offer</h2>
              <p className="text-lg text-gray-600">
                Viking Freight provides access to all major USPS shipping services at discounted rates.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-stone rounded-xl p-8">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Package className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">Priority Mail®</h3>
                <p className="text-gray-600 mb-4">
                  Fast delivery in 1-3 business days with tracking and insurance included.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Up to 70% off retail rates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Free package pickup</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">$50 of insurance included</span>
                  </li>
                </ul>
              </div>

              <div className="bg-stone rounded-xl p-8">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Clock className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">Priority Mail Express®</h3>
                <p className="text-gray-600 mb-4">
                  Overnight delivery to most U.S. addresses with money-back guarantee.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Up to 89% off retail rates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">365-day delivery</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">$100 of insurance included</span>
                  </li>
                </ul>
              </div>

              <div className="bg-stone rounded-xl p-8">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Package className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">First Class Package®</h3>
                <p className="text-gray-600 mb-4">
                  Affordable shipping for packages under 16 oz with tracking included.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Up to 60% off retail rates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Delivery in 1-3 business days</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Free tracking included</span>
                  </li>
                </ul>
              </div>

              <div className="bg-stone rounded-xl p-8">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Globe className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">International Shipping</h3>
                <p className="text-gray-600 mb-4">
                  Ship to over 190 countries worldwide with affordable rates and tracking.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Up to 40% off retail rates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Automated customs forms</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">International tracking</span>
                  </li>
                </ul>
              </div>

              <div className="bg-stone rounded-xl p-8">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Shield className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">Media Mail®</h3>
                <p className="text-gray-600 mb-4">
                  Economical shipping for books, DVDs, CDs, and other media materials.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Lowest rates for media</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Delivery in 2-8 business days</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Tracking included</span>
                  </li>
                </ul>
              </div>

              <div className="bg-stone rounded-xl p-8">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Truck className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">Parcel Select®</h3>
                <p className="text-gray-600 mb-4">
                  Cost-effective ground delivery for larger packages with tracking included.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Economical ground shipping</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Delivery in 2-8 business days</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">Free tracking included</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Savings Comparison */}
        <section className="py-24 bg-stone">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-6">See How Much You Can Save</h2>
              <p className="text-lg text-gray-600">
                Compare Viking Freight's discounted USPS rates with retail prices.
              </p>
            </div>

            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="p-4 text-left">Service</th>
                    <th className="p-4 text-center">Retail Price</th>
                    <th className="p-4 text-center">Viking Freight Price</th>
                    <th className="p-4 text-center">Savings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium">Priority Mail® (1 lb)</td>
                    <td className="p-4 text-center">$8.70</td>
                    <td className="p-4 text-center">$7.16</td>
                    <td className="p-4 text-center text-green-600 font-bold">18%</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white/50">
                    <td className="p-4 font-medium">Priority Mail® (5 lb)</td>
                    <td className="p-4 text-center">$18.95</td>
                    <td className="p-4 text-center">$10.78</td>
                    <td className="p-4 text-center text-green-600 font-bold">43%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium">Priority Mail Express® (1 lb)</td>
                    <td className="p-4 text-center">$26.95</td>
                    <td className="p-4 text-center">$22.75</td>
                    <td className="p-4 text-center text-green-600 font-bold">16%</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white/50">
                    <td className="p-4 font-medium">First Class Package® (8 oz)</td>
                    <td className="p-4 text-center">$5.50</td>
                    <td className="p-4 text-center">$3.37</td>
                    <td className="p-4 text-center text-green-600 font-bold">39%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium">Parcel Select® (2 lb)</td>
                    <td className="p-4 text-center">$8.55</td>
                    <td className="p-4 text-center">$6.92</td>
                    <td className="p-4 text-center text-green-600 font-bold">19%</td>
                  </tr>
                  <tr className="bg-white/50">
                    <td className="p-4 font-medium">Priority Mail® Flat Rate Envelope</td>
                    <td className="p-4 text-center">$9.65</td>
                    <td className="p-4 text-center">$7.75</td>
                    <td className="p-4 text-center text-green-600 font-bold">20%</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-500 mt-4">
                * Rates are examples and may vary based on destination, dimensions, and other factors. Rates as of April
                2024.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Ready to Simplify Your USPS Shipping?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Join Viking Freight and start saving on every USPS package.
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
