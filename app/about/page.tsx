import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Shield, Users, Globe, Award, Heart, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | AlienShipper",
  description: "Learn about AlienShipper's mission to provide free, discounted shipping for everyone.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6">About AlienShipper</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At AlienShipper, our mission is to make shipping accessible and affordable for everyone, from small
            businesses to individual senders. We leverage advanced alien technology to negotiate the best rates with top
            carriers like USPS® and UPS®, passing the savings directly to you. We believe in transparent pricing, no
            hidden fees, and a user-friendly experience that's out of this world.
          </p>
        </div>

        {/* Our Story */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-navy mb-6">Our Story</h2>
                  <p className="text-gray-600 mb-4">
                    AlienShipper was founded in 2014 by a team of shipping industry veterans who saw an opportunity to
                    disrupt the traditional shipping model. We believed that everyone deserved access to the same
                    discounted shipping rates and powerful shipping tools.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Our founders had firsthand experience with the challenges of high shipping costs and complex
                    logistics processes. They set out to create a solution that would level the playing field and make
                    shipping more affordable and accessible for everyone.
                  </p>
                  <p className="text-gray-600">
                    Today, AlienShipper serves thousands of businesses and individuals across the United States, helping
                    them save millions of dollars on shipping costs. Our platform continues to evolve with new features
                    and capabilities, but our mission remains the same: to provide the best shipping experience at the
                    lowest possible cost.
                  </p>
                </div>
                <div className="relative h-80 md:h-96">
                  <Image src="/alien-team.png" alt="AlienShipper team" fill className="object-cover rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-24 bg-stone">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600">
                At AlienShipper, we're committed to making shipping affordable, accessible, and efficient for everyone.
                We believe that everyone deserves access to discounted shipping rates and powerful shipping tools.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Shield className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">Transparency</h3>
                <p className="text-gray-600">
                  We believe in complete transparency in our pricing and business model. No hidden fees, no surprises.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Users className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">Accessibility</h3>
                <p className="text-gray-600">
                  We're committed to making enterprise-level shipping tools and rates accessible to everyone.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <div className="rounded-full bg-gold p-3 inline-flex mb-6">
                  <Zap className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">Innovation</h3>
                <p className="text-gray-600">
                  We continuously innovate to provide the best shipping experience and help our users stay ahead of the
                  curve.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-6">Our Values</h2>
              <p className="text-lg text-gray-600">
                These core values guide everything we do at AlienShipper, from product development to customer service.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="flex items-start">
                <div className="rounded-full bg-gold p-3 mr-4 shrink-0">
                  <Users className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy mb-2">Customer First</h3>
                  <p className="text-gray-600">
                    We put our customers at the center of everything we do. Their success is our success, and we're
                    committed to providing the tools and support they need to thrive.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="rounded-full bg-gold p-3 mr-4 shrink-0">
                  <Shield className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy mb-2">Integrity</h3>
                  <p className="text-gray-600">
                    We operate with honesty and transparency in all our dealings. We're straightforward about our
                    pricing and how we make money.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="rounded-full bg-gold p-3 mr-4 shrink-0">
                  <Award className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy mb-2">Excellence</h3>
                  <p className="text-gray-600">
                    We strive for excellence in everything we do, from the quality of our platform to the level of
                    customer service we provide.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="rounded-full bg-gold p-3 mr-4 shrink-0">
                  <Heart className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy mb-2">Community</h3>
                  <p className="text-gray-600">
                    We believe in building a strong community of users and partners who can learn from and support each
                    other.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="rounded-full bg-gold p-3 mr-4 shrink-0">
                  <Zap className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy mb-2">Innovation</h3>
                  <p className="text-gray-600">
                    We're constantly looking for new ways to improve our platform and provide more value to our users.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="rounded-full bg-gold p-3 mr-4 shrink-0">
                  <Globe className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy mb-2">Sustainability</h3>
                  <p className="text-gray-600">
                    We're committed to promoting sustainable shipping practices and reducing the environmental impact of
                    the shipping industry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 bg-stone">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-6">Our Leadership Team</h2>
              <p className="text-lg text-gray-600">
                Meet the experienced team behind AlienShipper. Our leaders bring decades of experience in shipping,
                logistics, and technology.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="relative h-64">
                  <Image src="/placeholder.svg?key=mg0kg" alt="Erik Thorson" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy">Erik Thorson</h3>
                  <p className="text-gold font-medium mb-3">CEO & Co-Founder</p>
                  <p className="text-gray-600 text-sm">
                    Former logistics executive with 15+ years of experience in the shipping industry.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="relative h-64">
                  <Image src="/placeholder.svg?key=0dlhq" alt="Astrid Larsen" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy">Astrid Larsen</h3>
                  <p className="text-gold font-medium mb-3">CTO & Co-Founder</p>
                  <p className="text-gray-600 text-sm">
                    Tech innovator with a background in developing logistics software solutions.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="relative h-64">
                  <Image src="/placeholder.svg?key=37wsk" alt="Magnus Olsen" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy">Magnus Olsen</h3>
                  <p className="text-gold font-medium mb-3">COO</p>
                  <p className="text-gray-600 text-sm">
                    Operations expert with experience scaling logistics companies globally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-navy text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the AlienShipper Community</h2>
            <p className="text-xl text-stone-300 max-w-2xl mx-auto mb-10">
              Thousands of businesses and individuals trust AlienShipper for their shipping needs. Start saving today.
            </p>
            <Button variant="gold" size="xl" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
