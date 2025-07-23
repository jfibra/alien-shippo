"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Mail,
  Phone,
  Send,
  Loader2,
  CheckCircle,
  MessageSquare,
  Search,
  Filter,
  Plus,
  Eye,
  Clock,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  status: "open" | "in_progress" | "resolved" | "closed"
  admin_notes?: string
  created_at: string
  updated_at: string
}

interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
}

interface SupportPageClientProps {
  initialTickets: SupportTicket[]
  userId: string
}

export function SupportPageClient({ initialTickets, userId }: SupportPageClientProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets)
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>(initialTickets)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isContactLoading, setIsContactLoading] = useState(false)
  const [isTicketLoading, setIsTicketLoading] = useState(false)
  const [isContactSubmitted, setIsContactSubmitted] = useState(false)
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isTicketDetailOpen, setIsTicketDetailOpen] = useState(false)
  const { toast } = useToast()

  // Contact form state
  const [contactForm, setContactForm] = useState<ContactMessage>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  // New ticket form state
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    message: "",
    category: "",
  })

  // Filter tickets
  useEffect(() => {
    let filtered = tickets

    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.message.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === filterStatus)
    }

    setFilteredTickets(filtered)
  }, [tickets, searchTerm, filterStatus])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsContactLoading(true)
    setIsContactSubmitted(false)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      })

      if (!response.ok) throw new Error("Failed to send message")

      setIsContactSubmitted(true)
      setContactForm({ name: "", email: "", subject: "", message: "" })

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully. We'll get back to you soon!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsContactLoading(false)
    }
  }

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsTicketLoading(true)

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ticketForm,
          user_id: userId,
        }),
      })

      if (!response.ok) throw new Error("Failed to create ticket")

      const newTicket = await response.json()
      setTickets((prev) => [newTicket, ...prev])
      setIsNewTicketOpen(false)
      setTicketForm({ subject: "", message: "", category: "" })

      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTicketLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const openTicketDetail = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setIsTicketDetailOpen(true)
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Support Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Get help with your account, shipments, and billing questions.
          </p>
        </div>
        <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>Create a support ticket for technical issues or account questions.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={ticketForm.category}
                  onValueChange={(value) => setTicketForm((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="billing">Billing & Payments</SelectItem>
                    <SelectItem value="shipment">Shipment Issues</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="account">Account Management</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ticket-subject">Subject</Label>
                <Input
                  id="ticket-subject"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>
              <div>
                <Label htmlFor="ticket-message">Description</Label>
                <Textarea
                  id="ticket-message"
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Provide detailed information about your issue..."
                  rows={6}
                  required
                />
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleTicketSubmit} disabled={isTicketLoading}>
                {isTicketLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Ticket"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets ({tickets.length})</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isContactSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground mb-6">
                      Your message has been sent successfully. We'll respond within 24 hours.
                    </p>
                    <Button onClick={() => setIsContactSubmitted(false)}>Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
                        placeholder="Briefly describe your inquiry"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder="Provide detailed information about your request..."
                        rows={6}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isContactLoading}>
                      {isContactLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                  <CardDescription>Reach us directly via phone or email.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <a href="mailto:support@vikingfreight.com" className="text-sm text-blue-600 hover:underline">
                        support@vikingfreight.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-gray-700">1-800-VIKING (1-800-845-464)</p>
                      <p className="text-xs text-muted-foreground">Mon-Fri, 9 AM - 5 PM EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Email Support</span>
                    <span className="text-sm font-medium">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Phone Support</span>
                    <span className="text-sm font-medium">Immediate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Technical Issues</span>
                    <span className="text-sm font-medium">Within 4 hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Support Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support Tickets</CardTitle>
              <CardDescription>View and manage your support tickets</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTickets.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || filterStatus !== "all"
                      ? "No tickets match your current filters."
                      : "You haven't created any support tickets yet."}
                  </p>
                  <Button onClick={() => setIsNewTicketOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Ticket
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openTicketDetail(ticket)}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(ticket.status)}
                              <h3 className="font-medium">{ticket.subject}</h3>
                              <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status.replace("_", " ").toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{ticket.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Created: {format(new Date(ticket.created_at), "MMM dd, yyyy")}</span>
                              <span>Updated: {format(new Date(ticket.updated_at), "MMM dd, yyyy")}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about our shipping services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">How do I add funds to my account?</h3>
                  <p className="text-sm text-gray-600">
                    You can add funds by going to Billing → Add Funds. We accept credit cards, PayPal, and bank
                    transfers.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">How do I track my shipments?</h3>
                  <p className="text-sm text-gray-600">
                    Go to Dashboard → Shipments to view all your shipments and their tracking information.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">What carriers do you support?</h3>
                  <p className="text-sm text-gray-600">
                    We support USPS, UPS, FedEx, and DHL for both domestic and international shipping.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">How do I get a refund?</h3>
                  <p className="text-sm text-gray-600">
                    Contact our support team with your shipment details and reason for refund. We'll process eligible
                    refunds within 5-7 business days.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Can I schedule pickups?</h3>
                  <p className="text-sm text-gray-600">
                    Yes, you can schedule pickups for UPS and FedEx shipments during the shipping process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ticket Detail Dialog */}
      <Dialog open={isTicketDetailOpen} onOpenChange={setIsTicketDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedTicket && getStatusIcon(selectedTicket.status)}
              <span>{selectedTicket?.subject}</span>
              {selectedTicket && (
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status.replace("_", " ").toUpperCase()}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Ticket created on{" "}
              {selectedTicket && format(new Date(selectedTicket.created_at), "MMMM dd, yyyy 'at' h:mm a")}
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Original Message</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>
              </div>
              {selectedTicket.admin_notes && (
                <div>
                  <Label className="text-sm font-medium">Admin Response</Label>
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedTicket.admin_notes}</p>
                  </div>
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-500">
                <span>Created: {format(new Date(selectedTicket.created_at), "MMM dd, yyyy 'at' h:mm a")}</span>
                <span>Last Updated: {format(new Date(selectedTicket.updated_at), "MMM dd, yyyy 'at' h:mm a")}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTicketDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
