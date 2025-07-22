"use client"

import { useState } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { submitContactForm } from "@/app/actions/contact-form"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      const result = await submitContactForm(formData)

      if (result.success) {
        toast({
          title: "Message Sent Successfully!",
          description: result.message,
        })

        // Reset form
        const form = document.getElementById("contact-form") as HTMLFormElement
        form?.reset()
      } else {
        toast({
          title: "Error Sending Message",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Contact form error:", error)
      toast({
        title: "Unexpected Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
                <Link href="mailto:support@vikingfreight.com" className="text-gold hover:underline">
                  support@vikingfreight.com
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
                <p className="mb-2">Viking Freight Headquarters</p>
                <p>123 Viking Way</p>
                <p>Norse City, CA 90210</p>
                <p>United States</p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-2xl mx-auto mt-16">
            <h2 className="text-3xl font-bold text-navy text-center mb-8">Send Us a Message</h2>
            <Card className="p-8">
              <form id="contact-form" action={handleSubmit} className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" placeholder="Enter your full name" required disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@example.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What can we help you with?"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please describe your question or issue in detail..."
                    rows={5}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
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
