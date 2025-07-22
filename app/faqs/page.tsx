import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "FAQs | AlienShipper",
  description: "Frequently Asked Questions about AlienShipper's free shipping software and services.",
}

export default function FAQsPage() {
  const faqs = [
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
    {
      question: "What carriers does AlienShipper support?",
      answer:
        "Currently, AlienShipper supports USPS® and UPS® for domestic and international shipments. We are constantly working to expand our network to include more Earth carriers.",
    },
    {
      question: "How do I get my shipping labels?",
      answer:
        "Once you've selected a rate and confirmed your shipment, you can instantly download and print your shipping labels directly from the AlienShipper platform. We support standard thermal and inkjet printers.",
    },
    {
      question: "Is my data secure with AlienShipper?",
      answer:
        "Absolutely. We prioritize the security of your data with advanced encryption and security protocols. Your information is protected with the latest alien cybersecurity measures.",
    },
    {
      question: "Can I integrate AlienShipper with my e-commerce store?",
      answer:
        "Yes! We offer seamless integrations with popular e-commerce platforms like Shopify, Etsy, eBay, WooCommerce, and more. Our API is also available for custom integrations.",
    },
    {
      question: "What kind of customer support do you offer?",
      answer:
        "We offer comprehensive customer support via email, and soon, live chat and phone. Our dedicated team of human and alien support specialists is ready to assist you.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600">Find quick answers to the most common questions about AlienShipper.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-medium text-navy hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-base">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
