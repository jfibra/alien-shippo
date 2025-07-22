import Link from "next/link"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, Package, DollarSign, Truck, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "How It Works | AlienShipper - Free Alien Shipping Software",
  description:
    "Learn how AlienShipper simplifies your shipping process in a few easy steps: sign up, connect stores, compare rates, print labels, and track shipments.",
  keywords: [
    "how shipping software works",
    "shipping process explained",
    "easy shipping solution",
    "streamline shipping",
    "shipping workflow",
    "get started with shipping",
  ],
  openGraph: {
    title: "How AlienShipper Works | Simple Shipping Solutions",
    description: "Understand the straightforward process of using AlienShipper to save time and money on shipping.",
    url: "https://alienshipper.com/how-it-works",
  },
  twitter: {
    title: "How AlienShipper Works | Easy Shipping",
    description: "A step-by-step guide to efficient and affordable shipping with AlienShipper.",
  },
  alternates: {
    canonical: "https://alienshipper.com/how-it-works",
  },
}

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Rocket,
      title: "1. Launch Your Free Account",
      description: "Sign up in minutes. No credit card required, no hidden fees. Just pure alien efficiency.",
    },
    {
      icon: Package,
      title: "2. Connect Your Stores",
      description:
        "Integrate with popular e-commerce platforms like Shopify, Etsy, eBay, and more. Or import orders manually.",
    },
    {
      icon: DollarSign,
      title: "3. Compare & Choose Rates",
      description:
        "Instantly compare discounted USPS® and UPS® rates. Select the best option for your budget and delivery speed.",
    },
    {
      icon: Truck,
      title: "4. Print Labels & Ship",
      description: "Generate and print shipping labels in seconds. Schedule pickups or drop off at your convenience.",
    },
  ]

  const processDetails = [
    {
      title: "Automated Order Import",
      description:
        "Connect your online stores and AlienShipper automatically imports your orders, ready for label creation. No more manual data entry!",
    },
    {
      title: "Smart Rate Comparison",
      description:
        "Our alien algorithms analyze your package details and destination to present you with the cheapest and fastest shipping options from top carriers.",
    },
    {
      title: "Streamlined Label Printing",
      description:
        "Print single labels or batches with ease. Compatible with standard thermal and inkjet printers. Includes packing slips.",
    },
    {
      title: "Real-Time Tracking & Notifications",
      description:
        "Keep your customers informed with automated tracking updates. Reduce 'where is my package?' inquiries.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-navy text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How AlienShipper Works</h1>
            <p className="text-xl text-stone-300 max-w-3xl mx-auto">
              Shipping made simple, efficient, and affordable. Follow these easy steps to start saving today.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-6">Your Journey to Galactic Savings</h2>
              <p className="text-lg text-gray-600">Getting started with AlienShipper is as easy as 1-2-3-4.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="p-6 text-center">
                  <CardHeader className="p-0 mb-4 flex flex-col items-center">
                    <div className="rounded-full bg-gold p-3 mb-4">
                      <step.icon className="h-8 w-8 text-navy" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-navy">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 text-gray-600">{step.description}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features/Process Details */}
        <section className="py-24 bg-stone">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-6">Dive Deeper into the Alien Process</h2>
              <p className="text-lg text-gray-600">
                Explore the advanced technology that powers your savings and efficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {processDetails.map((detail, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="rounded-full bg-gold p-2 shrink-0">
                    <CheckCircle className="h-6 w-6 text-navy" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-navy mb-2">{detail.title}</h3>
                    <p className="text-gray-600">{detail.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits CTA */}
        <section className="py-24 bg-navy text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience the AlienShipper Advantage</h2>
            <p className="text-xl text-stone-300 max-w-3xl mx-auto mb-10">
              Join thousands of businesses that have transformed their shipping with our free, powerful, and easy-to-use
              platform.
            </p>
            <Button variant="gold" size="xl" asChild>
              <Link href="/signup">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
