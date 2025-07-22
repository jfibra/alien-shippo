import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, DollarSign, Zap, Users, Star, Package, Globe, ShieldCheck, Check } from "lucide-react"
import { ShippingCalculatorSection } from "@/components/shipping-calculator-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="h-4 w-4" />
                  Alien-Powered Shipping
                </div>

                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Beam Your <span className="text-gold">Shipping</span>
                  <br />
                  <span className="text-gold">Costs Back</span>
                  <br />
                  Down To Earth
                </h1>

                <p className="text-lg md:text-xl text-stone-300 max-w-2xl">
                  Join the intergalactic fleet and save up to 89% on USPS, UPS, and DHL shipping rates. No monthly fees,
                  no commitments - just out-of-this-world savings powered by alien technology.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-stone-100 font-semibold px-8 py-3"
                    asChild
                  >
                    <Link href="/signup">Launch Your Savings</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 bg-transparent"
                    asChild
                  >
                    <Link href="/pricing">View Cosmic Rates</Link>
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <div className="flex items-center gap-2 text-stone-300">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>No setup fees</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>No Monthly Fees</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>24/7 alien support</span>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4">
                  <Image
                    src="/alien-delivery-ship.png"
                    alt="Alien UFO delivering packages with tractor beam"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-stone py-16">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <DollarSign className="h-10 w-10 text-gold mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-navy mb-2">Up to 89% Off</h3>
              <p className="text-gray-600">USPS® & UPS® Rates</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <Zap className="h-10 w-10 text-gold mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-navy mb-2">Instant Quotes</h3>
              <p className="text-gray-600">Real-time carrier rates</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <Users className="h-10 w-10 text-gold mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-navy mb-2">100% Free</h3>
              <p className="text-gray-600">No monthly fees, no markups</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-12">Powerful Features for Every Shipper</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 text-left">
                <CardHeader className="p-0 mb-4">
                  <Package className="h-8 w-8 text-gold" />
                  <CardTitle className="mt-4 text-xl font-semibold text-navy">Batch Label Creation</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-gray-600">
                  Create hundreds of labels at once, saving you time and effort. Perfect for high-volume shippers.
                </CardContent>
              </Card>
              <Card className="p-6 text-left">
                <CardHeader className="p-0 mb-4">
                  <Globe className="h-8 w-8 text-gold" />
                  <CardTitle className="mt-4 text-xl font-semibold text-navy">International Shipping</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-gray-600">
                  Easily manage customs forms and international documentation for seamless global delivery.
                </CardContent>
              </Card>
              <Card className="p-6 text-left">
                <CardHeader className="p-0 mb-4">
                  <ShieldCheck className="h-8 w-8 text-gold" />
                  <CardTitle className="mt-4 text-xl font-semibold text-navy">Shipping Insurance</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-gray-600">
                  Protect your valuable shipments with affordable insurance options directly within the platform.
                </CardContent>
              </Card>
              <Card className="p-6 text-left">
                <CardHeader className="p-0 mb-4">
                  <Truck className="h-8 w-8 text-gold" />
                  <CardTitle className="mt-4 text-xl font-semibold text-navy">Tracking & Notifications</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-gray-600">
                  Keep customers informed with real-time tracking updates and automated email notifications.
                </CardContent>
              </Card>
              <Card className="p-6 text-left">
                <CardHeader className="p-0 mb-4">
                  <Star className="h-8 w-8 text-gold" />
                  <CardTitle className="mt-4 text-xl font-semibold text-navy">Address Validation</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-gray-600">
                  Reduce delivery errors and surcharges with automatic address verification.
                </CardContent>
              </Card>
              <Card className="p-6 text-left">
                <CardHeader className="p-0 mb-4">
                  <DollarSign className="h-8 w-8 text-gold" />
                  <CardTitle className="mt-4 text-xl font-semibold text-navy">Cost Reporting</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-gray-600">
                  Gain insights into your shipping spend with detailed reports and analytics.
                </CardContent>
              </Card>
            </div>
            <Button variant="default" size="lg" asChild className="mt-12 bg-gold text-navy hover:bg-gold/90">
              <Link href="/features">Explore All Features</Link>
            </Button>
          </div>
        </section>

        {/* Shipping Calculator Section */}
        <ShippingCalculatorSection
          title="Calculate Your Cosmic Shipping Rates"
          description="See how much you can save with AlienShipper's alien-negotiated rates."
          className="bg-stone"
        />

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-12">What Our Earth Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6 text-left">
                <CardContent className="p-0">
                  <p className="text-lg text-gray-700 mb-4">
                    "AlienShipper has revolutionized our small business shipping. The savings are incredible, and the
                    platform is so easy to use. It's like magic!"
                  </p>
                  <div className="font-semibold text-navy">- Jane Doe, Small Business Owner</div>
                </CardContent>
              </Card>
              <Card className="p-6 text-left">
                <CardContent className="p-0">
                  <p className="text-lg text-gray-700 mb-4">
                    "I used to spend hours comparing rates. Now, with AlienShipper, I get the best prices instantly.
                    Plus, their support is out of this world!"
                  </p>
                  <div className="font-semibold text-navy">- John Smith, E-commerce Manager</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-navy text-white py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Ship Like an Alien?</h2>
            <p className="text-lg md:text-xl text-stone-300 max-w-3xl mx-auto mb-10">
              Join thousands of businesses saving money and time with AlienShipper. It's free to start, no credit card
              required.
            </p>
            <Button size="lg" className="bg-gold text-navy hover:bg-gold/90 font-semibold px-8 py-3" asChild>
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
