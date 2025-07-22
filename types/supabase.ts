export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          company: string | null
          company_name: string | null
          country: string
          created_at: string
          email: string | null
          id: string
          is_deleted: boolean | null
          is_residential: boolean | null
          name: string | null
          phone: string | null
          postal_code: string
          state: string
          street1: string
          street2: string | null
          updated_at: string
          user_id: string
          address_type: "shipping" | "billing" | "both"
          is_default: boolean | null
        }
        Insert: {
          city: string
          company?: string | null
          company_name?: string | null
          country: string
          email?: string | null
          id?: string
          is_deleted?: boolean | null
          is_residential?: boolean | null
          name?: string | null
          phone?: string | null
          postal_code: string
          state: string
          street1: string
          street2?: string | null
          user_id: string
          address_type?: "shipping" | "billing" | "both"
          is_default?: boolean | null
        }
        Update: {
          city?: string
          company?: string | null
          company_name?: string | null
          country?: string
          email?: string | null
          id?: string
          is_deleted?: boolean | null
          is_residential?: boolean | null
          name?: string | null
          phone?: string | null
          postal_code?: string
          state?: string
          street1?: string
          street2?: string | null
          updated_at?: string
          user_id?: string
          address_type?: "shipping" | "billing" | "both"
          is_default?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            referencedTable: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_test: boolean
          key_name: string
          key_value: string
          user_id: string
        }
        Insert: {
          is_active?: boolean
          is_test?: boolean
          key_name: string
          key_value: string
          user_id: string
        }
        Update: {
          is_active?: boolean
          is_test?: boolean
          key_name?: string
          key_value?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            referencedTable: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          brand: string | null
          created_at: string
          exp_month: number | null
          exp_year: number | null
          id: string
          is_default: boolean | null
          last_four: string | null
          provider: string | null
          token: string | null
          updated_at: string
          user_id: string
          billing_zip: string | null
        }
        Insert: {
          brand?: string | null
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          provider?: string | null
          token?: string | null
          user_id: string
          billing_zip?: string | null
        }
        Update: {
          brand?: string | null
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          provider?: string | null
          token?: string | null
          updated_at?: string
          user_id?: string
          billing_zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            referencedTable: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rates: {
        Row: {
          amount: number
          carrier: string
          created_at: string
          currency: string
          duration_terms: string | null
          estimated_days: number | null
          id: string
          service_level: string
          service_level_name: string
          package_type_id: string | null
          package_type_name: string | null
          service_id: string | null
        }
        Insert: {
          amount: number
          carrier: string
          currency: string
          duration_terms?: string | null
          estimated_days?: number | null
          id?: string
          service_level: string
          service_level_name: string
          package_type_id?: string | null
          package_type_name?: string | null
          service_id?: string | null
        }
        Update: {
          amount?: number
          carrier?: string
          created_at?: string
          currency?: string
          duration_terms?: string | null
          estimated_days?: number | null
          id?: string
          service_level?: string
          service_level_name?: string
          package_type_id?: string | null
          package_type_name?: string | null
          service_id?: string | null
        }
        Relationships: []
      }
      shipments: {
        Row: {
          carrier: string | null
          contents_type: string | null
          cost: string | null
          created_at: string
          currency: string | null
          customs_value: number | null
          dimensions: Json | null
          from_address_id: string | null
          has_return_label: boolean | null
          id: string
          insurance_type: string | null
          is_non_machinable: boolean | null
          label_url: string | null
          rate_id: string | null
          require_signature: boolean | null
          service: string | null
          service_name: string | null
          status: string | null
          to_address_id: string | null
          tracking_number: string | null
          updated_at: string
          user_id: string
          weight_oz: number | null
          package_type: string | null
        }
        Insert: {
          carrier?: string | null
          contents_type?: string | null
          cost?: string | null
          currency?: string | null
          customs_value?: number | null
          dimensions?: Json | null
          from_address_id?: string | null
          has_return_label?: boolean | null
          id?: string
          insurance_type?: string | null
          is_non_machinable?: boolean | null
          label_url?: string | null
          rate_id?: string | null
          require_signature?: boolean | null
          service?: string | null
          service_name?: string | null
          status?: string | null
          to_address_id?: string | null
          tracking_number?: string | null
          user_id: string
          weight_oz?: number | null
          package_type?: string | null
        }
        Update: {
          carrier?: string | null
          contents_type?: string | null
          cost?: string | null
          currency?: string | null
          customs_value?: number | null
          dimensions?: Json | null
          from_address_id?: string | null
          has_return_label?: boolean | null
          id?: string
          insurance_type?: string | null
          is_non_machinable?: boolean | null
          label_url?: string | null
          rate_id?: string | null
          require_signature?: boolean | null
          service?: string | null
          service_name?: string | null
          status?: string | null
          to_address_id?: string | null
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
          weight_oz?: number | null
          package_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_from_address_id_fkey"
            columns: ["from_address_id"]
            referencedTable: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_to_address_id_fkey"
            columns: ["to_address_id"]
            referencedTable: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_user_id_fkey"
            columns: ["user_id"]
            referencedTable: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          admin_notes: string | null
          assigned_to: string | null
          created_at: string
          id: string
          message: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          assigned_to?: string | null
          created_at?: string
          id?: string
          message: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          assigned_to?: string | null
          created_at?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedTable: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            referencedTable: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          payment_method_id: string | null
          provider: string | null
          shipment_id: string | null
          status: string | null
          transaction_type: string | null
          updated_at: string
          user_id: string
          external_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          payment_method_id?: string | null
          provider?: string | null
          shipment_id?: string | null
          status?: string | null
          transaction_type?: string | null
          updated_at?: string
          user_id: string
          external_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          payment_method_id?: string | null
          provider?: string | null
          shipment_id?: string | null
          status?: string | null
          transaction_type?: string | null
          updated_at?: string
          user_id?: string
          external_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            referencedTable: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_accounts: {
        Row: {
          balance: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_accounts_user_id_fkey"
            columns: ["user_id"]
            referencedTable: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          description: string | null
          id: string
          timestamp: string
          user_id: string
          details: Json | null
        }
        Insert: {
          activity_type: string
          description?: string | null
          id?: string
          timestamp?: string
          user_id: string
          details?: Json | null
        }
        Update: {
          activity_type?: string
          description?: string | null
          id?: string
          timestamp?: string
          user_id?: string
          details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            referencedTable: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          auto_refresh_status: boolean | null
          confirm_actions: boolean | null
          date_format: string | null
          default_package: string | null
          default_service: string | null
          dimension_unit: string | null
          id: string
          time_zone: string | null
          user_id: string
          weight_unit: string | null
        }
        Insert: {
          auto_refresh_status?: boolean | null
          confirm_actions?: boolean | null
          date_format?: string | null
          default_package?: string | null
          default_service?: string | null
          dimension_unit?: string | null
          id?: string
          time_zone?: string | null
          user_id: string
          weight_unit?: string | null
        }
        Update: {
          auto_refresh_status?: boolean | null
          confirm_actions?: boolean | null
          date_format?: string | null
          default_package?: string | null
          default_service?: string | null
          dimension_unit?: string | null
          id?: string
          time_zone?: string | null
          user_id?: string
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedTable: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_funds: {
        Args: {
          p_user_id: string
          p_amount: number
        }
        Returns: undefined
      }
      deduct_funds: {
        Args: {
          p_user_id: string
          p_amount: number
          currency_param: string
        }
        Returns: undefined
      }
      get_shipment_metrics: {
        Args: {
          start_date: Date
          end_date: Date
        }
        Returns: {
          total_shipments: number
          total_revenue: number
        }
      }
      get_shipping_spent: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      get_user_addresses: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          name: string
          street1: string
          street2: string
          city: string
          state: string
          zip: string
          country: string
          is_residential: boolean
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
