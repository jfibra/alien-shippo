// Define common types used across the application

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name?: string
  email_verified: boolean
  phone?: string | null
  role: "user" | "admin" | "support"
  created_at: string
  last_login?: string | null
}

export interface Address {
  id: string
  user_id: string
  name: string
  recipient: string
  company?: string | null
  address1: string
  address2?: string | null
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string | null
  email?: string | null
  address_type: "shipping" | "return" | "both"
  type: "residential" | "commercial"
  is_default: boolean
  created_at: string
}

export interface PaymentMethod {
  id: string
  user_id: string
  type: "card" | "paypal" | "bank_transfer"
  details: {
    last4?: string
    brand?: string
    email?: string
    bank_name?: string
    account_type?: string
  }
  is_default: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: "deposit" | "withdrawal" | "shipment_cost" | "refund"
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  description?: string
  created_at: string
  related_id?: string // e.g., shipment_id, payment_method_id
}

// Removed Notification interface
// export interface Notification {
//   id: string
//   user_id: string
//   type: "info" | "warning" | "error" | "success"
//   message: string
//   read: boolean
//   created_at: string
//   link?: string
// }

export interface ActivityLog {
  id: string
  user_id: string
  action: string // e.g., 'login', 'shipment_created', 'funds_added'
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface Shipment {
  id: string
  user_id: string
  tracking_number: string
  carrier: string
  service: string
  status: string // e.g., 'pre_transit', 'in_transit', 'delivered', 'exception'
  from_address_id: string
  to_address_id: string
  package_details: {
    weight: number
    dimensions?: { length: number; width: number; height: number; unit: string }
    type: string // e.g., 'parcel', 'letter', 'flat'
  }
  cost: number
  currency: string
  created_at: string
  updated_at: string
  estimated_delivery?: string | null
  actual_delivery?: string | null
  label_url?: string | null
  tracking_url?: string | null
}

export interface ShippingRate {
  id: string
  service: string
  carrier: string
  rate: number
  delivery_days: number | null
  estimated_days: number | null
  duration_terms: string | null
  currency?: string
}
