import Link from "next/link"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ShippingCalculator } from "@/components/shipping-calculator" // Imported here
import { CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing | AlienShipper - Free Alien Shipping Software",
  description:
    "AlienShipper is 100% free! Save up to 89% on USPS and UPS shipping rates with no monthly fees, no minimums, no markup. Start saving today.",
  keywords: [
    "free shipping software",
    "no monthly fees shipping",
    "discounted USPS rates",
    "cheap UPS shipping",
    "alien shipping pricing",
    "free shipping labels",
    "no markup shipping",
    "small business shipping costs",
  ],
  openGraph: {
    title: "AlienShipper Pricing | 100% Free Alien Shipping Software",
    description:
      "Save up to 89% on shipping with no monthly fees, no hidden costs. AlienShipper is completely free to use.",
    url: "https://alienshipper.com/pricing",
  },
  twitter: {
    title: "AlienShipper Pricing | 100% Free Shipping Software",
    description: "Save up to 89% on shipping with no monthly fees or hidden costs.",
  },
  alternates: {
    canonical: "https://alienshipper.com/pricing",
  },
}

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-navy text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Alien Pricing</h1>
            <p className="text-xl text-stone-300 max-w-3xl mx-auto">
              AlienShipper saves you money on every shipment with alien-negotiated USPS® and UPS® rates. No monthly
              fees, no hidden costs, no markups - just pure alien efficiency.
            </p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-6">100% Free Alien Technology</h2>
              <p className="text-lg text-gray-600">
                AlienShipper is completely free to use with no monthly fees, no markup on postage, and no hidden costs.
                Our alien overlords demand it.
              </p>
            </div>

            <div className="max-w-3xl mx-auto bg-stone rounded-xl shadow-sm overflow-hidden p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-gold p-3">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
                    <path d="M12 2L4 6V12C4 15.31 7.58 19.5 12 22C16.42 19.5 20 15.31 20 12V6L12 2Z" fill="#0B1D30" />
                    <path d="M11.37 17L8 13.63V10.5H9.5V13L12.13 15.63L11.37 17Z" fill="#D4AF37" />
                    <path d="M16 10.5H14.5V13L11.87 15.63L12.63 17L16 13.63V10.5Z" fill="#D4AF37" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-navy text-center mb-6">AlienShipper</h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium text-navy mb-4">Included Alien Features:</h4>
                  <ul className="space-y-3">
                    {[
                      "Alien-negotiated USPS® rates (up to 89% off)",
                      "Quantum-discounted UPS® rates",
                      "Unlimited teleportation labels",
                      "Batch label creation across dimensions",
                      "Free tracking & alien notifications",
                      "Galactic address verification",
                      "Cosmic shipping insurance options",
                      "Detailed quantum reporting & analytics",
                    ].map((feature) => (
                      <li key={feature} className="flex">
                        <CheckCircle className="h-5 w-5 text-gold shrink-0" />
                        <span className="ml-3 text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-navy mb-4">Additional Alien Benefits:</h4>
                  <ul className="space-y-3">
                    {[
                      "No monthly alien fees",
                      "No markup on postage",
                      "No minimum shipping requirements",
                      "Free alien customer support",
                      "Universal platform integrations",
                      "API access for Earth developers",
                      "Customizable alien preferences",
                      "Intergalactic shipping options",
                    ].map((feature) => (
                      <li key={feature} className="flex">
                        <CheckCircle className="h-5 w-5 text-gold shrink-0" />
                        <span className="ml-3 text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button variant="gold" size="xl" asChild>
                  <Link href="/signup">Launch Your Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Calculator */}
        <section className="py-24 bg-stone">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-6">Calculate Your Galactic Shipping Rates</h2>
              <p className="text-lg text-gray-600">
                See how much you can save with AlienShipper's alien-negotiated rates.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <ShippingCalculator /> {/* Rendered here */}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-6">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">
                Get answers to common questions about our alien pricing and features.
              </p>
            </div>

            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              {[
                {
                  question: "Is AlienShipper really free to use?",
                  answer:
                    "Yes! Our Free plan has no monthly fees or subscription costs. We make money from a small portion of the discount we get from Earth carriers through our alien negotiations, but you still save significantly compared to retail rates.",
                },
                {
                  question: "How do your alien rates compare to USPS and UPS retail prices?",
                  answer:
                    "Our customers typically save 30-89% compared to retail rates thanks to our advanced alien negotiation technology. The exact savings depend on the service, package dimensions, weight, and destination.",
                },
                {
                  question: "Are there any hidden fees or alien charges?",
                  answer:
                    "No. We're committed to transparent pricing across all galaxies. There are no hidden fees, no markup on postage, and no minimum shipping requirements.",
                },
                {
                  question: "Do I need existing Earth carrier accounts?",
                  answer:
                    "No, you don't need existing carrier accounts. You can create new ones through our alien platform, or connect your existing Earth accounts if you prefer.",
                },
                {
                  question: "Can I cancel my subscription at any time?",
                  answer:
                    "Yes, you can upgrade, downgrade, or cancel your subscription at any time without any penalties or fees. Our alien overlords are very understanding.",
                },
              ].map((faq, index) => (
                <div key={index} className="py-6">
                  <h3 className="text-lg font-medium text-navy">{faq.question}</h3>
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-navy text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Saving with Alien Technology Today</h2>
            <p className="text-xl text-stone-300 max-w-2xl mx-auto mb-10">
              Join thousands of businesses that save money with AlienShipper's alien shipping technology. No risk, no
              commitment.
            </p>
            <Button variant="gold" size="xl" asChild>
              <Link href="/signup">Launch Your Account</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
