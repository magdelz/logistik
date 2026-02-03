export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'manager' | 'client'
export type OrderStatus = 'pending' | 'confirmed' | 'pickup' | 'in_transit' | 'delivered' | 'cancelled'
export type CargoType = 'standard' | 'fragile' | 'perishable' | 'hazardous' | 'oversized' | 'valuable'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: UserRole
          company_name: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          role?: UserRole
          company_name?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: UserRole
          company_name?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          profile_id: string | null
          label: string
          country: string
          city: string
          street: string
          building: string | null
          apartment: string | null
          postal_code: string | null
          latitude: number | null
          longitude: number | null
          is_default: boolean
          contact_name: string | null
          contact_phone: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          label: string
          country?: string
          city: string
          street: string
          building?: string | null
          apartment?: string | null
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          is_default?: boolean
          contact_name?: string | null
          contact_phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          label?: string
          country?: string
          city?: string
          street?: string
          building?: string | null
          apartment?: string | null
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          is_default?: boolean
          contact_name?: string | null
          contact_phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tariffs: {
        Row: {
          id: string
          name: string
          description: string | null
          base_price: number
          price_per_kg: number
          price_per_km: number
          price_per_m3: number
          min_weight: number
          max_weight: number | null
          delivery_days_min: number
          delivery_days_max: number
          cargo_types: CargoType[]
          is_express: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          base_price: number
          price_per_kg: number
          price_per_km: number
          price_per_m3?: number
          min_weight?: number
          max_weight?: number | null
          delivery_days_min?: number
          delivery_days_max?: number
          cargo_types?: CargoType[]
          is_express?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          base_price?: number
          price_per_kg?: number
          price_per_km?: number
          price_per_m3?: number
          min_weight?: number
          max_weight?: number | null
          delivery_days_min?: number
          delivery_days_max?: number
          cargo_types?: CargoType[]
          is_express?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      routes: {
        Row: {
          id: string
          name: string
          origin_city: string
          destination_city: string
          distance_km: number
          estimated_hours: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          origin_city: string
          destination_city: string
          distance_km: number
          estimated_hours?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          origin_city?: string
          destination_city?: string
          distance_km?: number
          estimated_hours?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          client_id: string
          manager_id: string | null
          tariff_id: string | null
          route_id: string | null
          pickup_address_id: string | null
          pickup_city: string
          pickup_street: string
          pickup_building: string | null
          pickup_contact_name: string
          pickup_contact_phone: string
          pickup_date: string | null
          pickup_time_from: string | null
          pickup_time_to: string | null
          delivery_address_id: string | null
          delivery_city: string
          delivery_street: string
          delivery_building: string | null
          delivery_contact_name: string
          delivery_contact_phone: string
          delivery_date: string | null
          delivery_time_from: string | null
          delivery_time_to: string | null
          cargo_description: string
          cargo_type: CargoType
          weight_kg: number
          volume_m3: number | null
          length_cm: number | null
          width_cm: number | null
          height_cm: number | null
          pieces_count: number
          declared_value: number | null
          is_fragile: boolean
          requires_temperature_control: boolean
          temperature_min: number | null
          temperature_max: number | null
          distance_km: number | null
          base_cost: number
          weight_cost: number
          distance_cost: number
          volume_cost: number
          insurance_cost: number
          extra_services_cost: number
          discount_amount: number
          total_cost: number
          status: OrderStatus
          payment_status: PaymentStatus
          tracking_code: string | null
          current_location: string | null
          estimated_delivery_date: string | null
          actual_delivery_date: string | null
          client_notes: string | null
          internal_notes: string | null
          created_at: string
          updated_at: string
          confirmed_at: string | null
          picked_up_at: string | null
          delivered_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
        }
        Insert: {
          id?: string
          order_number?: string
          client_id: string
          manager_id?: string | null
          tariff_id?: string | null
          route_id?: string | null
          pickup_address_id?: string | null
          pickup_city: string
          pickup_street: string
          pickup_building?: string | null
          pickup_contact_name: string
          pickup_contact_phone: string
          pickup_date?: string | null
          pickup_time_from?: string | null
          pickup_time_to?: string | null
          delivery_address_id?: string | null
          delivery_city: string
          delivery_street: string
          delivery_building?: string | null
          delivery_contact_name: string
          delivery_contact_phone: string
          delivery_date?: string | null
          delivery_time_from?: string | null
          delivery_time_to?: string | null
          cargo_description: string
          cargo_type?: CargoType
          weight_kg: number
          volume_m3?: number | null
          length_cm?: number | null
          width_cm?: number | null
          height_cm?: number | null
          pieces_count?: number
          declared_value?: number | null
          is_fragile?: boolean
          requires_temperature_control?: boolean
          temperature_min?: number | null
          temperature_max?: number | null
          distance_km?: number | null
          base_cost: number
          weight_cost?: number
          distance_cost?: number
          volume_cost?: number
          insurance_cost?: number
          extra_services_cost?: number
          discount_amount?: number
          total_cost: number
          status?: OrderStatus
          payment_status?: PaymentStatus
          tracking_code?: string | null
          current_location?: string | null
          estimated_delivery_date?: string | null
          actual_delivery_date?: string | null
          client_notes?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          picked_up_at?: string | null
          delivered_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          client_id?: string
          manager_id?: string | null
          tariff_id?: string | null
          route_id?: string | null
          pickup_address_id?: string | null
          pickup_city?: string
          pickup_street?: string
          pickup_building?: string | null
          pickup_contact_name?: string
          pickup_contact_phone?: string
          pickup_date?: string | null
          pickup_time_from?: string | null
          pickup_time_to?: string | null
          delivery_address_id?: string | null
          delivery_city?: string
          delivery_street?: string
          delivery_building?: string | null
          delivery_contact_name?: string
          delivery_contact_phone?: string
          delivery_date?: string | null
          delivery_time_from?: string | null
          delivery_time_to?: string | null
          cargo_description?: string
          cargo_type?: CargoType
          weight_kg?: number
          volume_m3?: number | null
          length_cm?: number | null
          width_cm?: number | null
          height_cm?: number | null
          pieces_count?: number
          declared_value?: number | null
          is_fragile?: boolean
          requires_temperature_control?: boolean
          temperature_min?: number | null
          temperature_max?: number | null
          distance_km?: number | null
          base_cost?: number
          weight_cost?: number
          distance_cost?: number
          volume_cost?: number
          insurance_cost?: number
          extra_services_cost?: number
          discount_amount?: number
          total_cost?: number
          status?: OrderStatus
          payment_status?: PaymentStatus
          tracking_code?: string | null
          current_location?: string | null
          estimated_delivery_date?: string | null
          actual_delivery_date?: string | null
          client_notes?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          picked_up_at?: string | null
          delivered_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
        }
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          status: OrderStatus
          location: string | null
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          status: OrderStatus
          location?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          status?: OrderStatus
          location?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Functions: {
      get_user_role: {
        Args: Record<string, never>
        Returns: UserRole
      }
      calculate_order_cost: {
        Args: {
          p_tariff_id: string
          p_weight_kg: number
          p_distance_km: number
          p_volume_m3?: number
          p_declared_value?: number
        }
        Returns: {
          base_cost: number
          weight_cost: number
          distance_cost: number
          volume_cost: number
          insurance_cost: number
          total_cost: number
        }[]
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Profile = Tables<'profiles'>
export type Address = Tables<'addresses'>
export type Tariff = Tables<'tariffs'>
export type Route = Tables<'routes'>
export type Order = Tables<'orders'>
export type OrderStatusHistory = Tables<'order_status_history'>
export type ActivityLog = Tables<'activity_logs'>
export type Notification = Tables<'notifications'>

export interface OrderWithRelations extends Order {
  client?: Profile
  manager?: Profile
  tariff?: Tariff
  route?: Route
  status_history?: OrderStatusHistory[]
}
