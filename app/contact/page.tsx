import Link from "next/link"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | AlienShipper",
  description: "Get in touch with AlienShipper support for any questions or assistance.",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6">Contact Us</h1>
            <p className="text-lg text-gray-600">
              We're here to help! Reach out to us through any of the methods below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <CardHeader className="p-0 mb-4 flex items-center gap-4">
                <Mail className="h-8 w-8 text-gold" />
                <CardTitle className="text-xl font-semibold text-navy">Email Support</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-gray-600">
                <p className="mb-2">For general inquiries or support, email us at:</p>
                <Link href="mailto:support@alienshipper.com" className="text-gold hover:underline">
                  support@alienshipper.com
                </Link>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader className="p-0 mb-4 flex items-center gap-4">
                <Phone className="h-8 w-8 text-gold" />
                <CardTitle className="text-xl font-semibold text-navy">Phone Support</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-gray-600">
                <p className="mb-2">For urgent matters, you can reach us at:</p>
                <p className="font-semibold text-navy">(123) 456-7890</p>
                <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 5 PM EST</p>
              </CardContent>
            </Card>
            <Card className="p-6 md:col-span-2">
              <CardHeader className="p-0 mb-4 flex items-center gap-4">
                <MapPin className="h-8 w-8 text-gold" />
                <CardTitle className="text-xl font-semibold text-navy">Our Location</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-gray-600">
                <p className="mb-2">AlienShipper Headquarters</p>
                <p>123 Galaxy Way</p>
                <p>Cosmic City, CA 90210</p>
                <p>Milky Way Galaxy</p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-2xl mx-auto mt-16">
            <h2 className="text-3xl font-bold text-navy text-center mb-8">Send Us a Message</h2>
            <Card className="p-8">
              <form className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Regarding..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="How can we help you?" rows={5} />
                </div>
                <Button type="submit" variant="gold" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
