// Supabase Database Types
// This file defines the complete database schema for the automotive platform

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // User profiles table
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: "customer" | "technician" | "supervisor" | "admin"
          company_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: "customer" | "technician" | "supervisor" | "admin"
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: "customer" | "technician" | "supervisor" | "admin"
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      
      // Companies table (multi-tenant)
      companies: {
        Row: {
          id: string
          name: string
          slug: string
          active: boolean
          plan_type: "basic" | "professional" | "enterprise"
          created_date: string
          contact_email: string
          phone: string | null
          address: string | null
          logo_url: string | null
          settings: Json | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          active?: boolean
          plan_type?: "basic" | "professional" | "enterprise"
          created_date?: string
          contact_email: string
          phone?: string | null
          address?: string | null
          logo_url?: string | null
          settings?: Json | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          active?: boolean
          plan_type?: "basic" | "professional" | "enterprise"
          created_date?: string
          contact_email?: string
          phone?: string | null
          address?: string | null
          logo_url?: string | null
          settings?: Json | null
        }
      }
      
      // Locations table
      locations: {
        Row: {
          id: string
          name: string
          company_id: string
          address: string | null
          phone: string | null
          manager_id: string | null
          active: boolean
          timezone: string | null
          business_hours: Json | null
        }
        Insert: {
          id?: string
          name: string
          company_id: string
          address?: string | null
          phone?: string | null
          manager_id?: string | null
          active?: boolean
          timezone?: string | null
          business_hours?: Json | null
        }
        Update: {
          id?: string
          name?: string
          company_id?: string
          address?: string | null
          phone?: string | null
          manager_id?: string | null
          active?: boolean
          timezone?: string | null
          business_hours?: Json | null
        }
      }
      
      // Customers table
      customers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          address: string | null
          company_id: string
          location_id: string | null
          created_at: string
          updated_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          company_id: string
          location_id?: string | null
          created_at?: string
          updated_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          company_id?: string
          location_id?: string | null
          created_at?: string
          updated_at?: string
          notes?: string | null
        }
      }
      
      // Vehicles table
      vehicles: {
        Row: {
          vin: string
          year: number
          make: string
          model: string
          trim: string | null
          customer_id: string
          mileage: number | null
          color: string | null
          license_plate: string | null
          engine_type: string | null
          transmission: string | null
          fuel_type: string | null
          vehicle_data: Json | null
          created_at: string
          updated_at: string
          last_service_date: string | null
        }
        Insert: {
          vin: string
          year: number
          make: string
          model: string
          trim?: string | null
          customer_id: string
          mileage?: number | null
          color?: string | null
          license_plate?: string | null
          engine_type?: string | null
          transmission?: string | null
          fuel_type?: string | null
          vehicle_data?: Json | null
          created_at?: string
          updated_at?: string
          last_service_date?: string | null
        }
        Update: {
          vin?: string
          year?: number
          make?: string
          model?: string
          trim?: string | null
          customer_id?: string
          mileage?: number | null
          color?: string | null
          license_plate?: string | null
          engine_type?: string | null
          transmission?: string | null
          fuel_type?: string | null
          vehicle_data?: Json | null
          created_at?: string
          updated_at?: string
          last_service_date?: string | null
        }
      }
      
      // Support tickets table
      support_tickets: {
        Row: {
          id: string
          ticket_number: string
          customer_id: string
          vehicle_vin: string | null
          location_id: string
          assigned_technician_id: string | null
          assigned_support_agent_id: string | null
          status: "new" | "in_progress" | "waiting_customer" | "waiting_parts" | "ready_for_pickup" | "resolved" | "closed"
          priority: "low" | "medium" | "high" | "urgent"
          category: string | null
          issue_summary: string
          detailed_description: string | null
          ai_analysis: Json | null
          ai_confidence_score: number | null
          resolution_notes: string | null
          created_at: string
          updated_at: string
          resolved_at: string | null
          estimated_hours: number | null
          actual_hours: number | null
          customer_satisfaction: number | null
        }
        Insert: {
          id?: string
          ticket_number: string
          customer_id: string
          vehicle_vin?: string | null
          location_id: string
          assigned_technician_id?: string | null
          assigned_support_agent_id?: string | null
          status?: "new" | "in_progress" | "waiting_customer" | "waiting_parts" | "ready_for_pickup" | "resolved" | "closed"
          priority?: "low" | "medium" | "high" | "urgent"
          category?: string | null
          issue_summary: string
          detailed_description?: string | null
          ai_analysis?: Json | null
          ai_confidence_score?: number | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          customer_satisfaction?: number | null
        }
        Update: {
          id?: string
          ticket_number?: string
          customer_id?: string
          vehicle_vin?: string | null
          location_id?: string
          assigned_technician_id?: string | null
          assigned_support_agent_id?: string | null
          status?: "new" | "in_progress" | "waiting_customer" | "waiting_parts" | "ready_for_pickup" | "resolved" | "closed"
          priority?: "low" | "medium" | "high" | "urgent"
          category?: string | null
          issue_summary?: string
          detailed_description?: string | null
          ai_analysis?: Json | null
          ai_confidence_score?: number | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          customer_satisfaction?: number | null
        }
      }
      
      // Chat messages table
      chat_messages: {
        Row: {
          id: string
          user_id: string
          message: string
          response: string | null
          ai_provider: string | null
          confidence_score: number | null
          session_id: string | null
          created_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          response?: string | null
          ai_provider?: string | null
          confidence_score?: number | null
          session_id?: string | null
          created_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          response?: string | null
          ai_provider?: string | null
          confidence_score?: number | null
          session_id?: string | null
          created_at?: string
          metadata?: Json | null
        }
      }
      
      // Chat attachments table
      chat_attachments: {
        Row: {
          id: string
          message_id: string
          file_name: string
          file_type: string
          file_url: string
          file_size: number | null
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          file_name: string
          file_type: string
          file_url: string
          file_size?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          file_name?: string
          file_type?: string
          file_url?: string
          file_size?: number | null
          created_at?: string
        }
      }
      
      // Conversation threads table
      conversation_threads: {
        Row: {
          id: string
          support_ticket_id: string
          thread_id: string
          conversation_type: "voice_call" | "chat_message" | "photo_upload" | "internal_note" | "ai_analysis" | "system_event"
          content: string
          ai_generated: boolean
          participant_id: string | null
          timestamp: string
          confidence_score: number | null
          attachments: string[] | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          support_ticket_id: string
          thread_id: string
          conversation_type: "voice_call" | "chat_message" | "photo_upload" | "internal_note" | "ai_analysis" | "system_event"
          content: string
          ai_generated?: boolean
          participant_id?: string | null
          timestamp?: string
          confidence_score?: number | null
          attachments?: string[] | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          support_ticket_id?: string
          thread_id?: string
          conversation_type?: "voice_call" | "chat_message" | "photo_upload" | "internal_note" | "ai_analysis" | "system_event"
          content?: string
          ai_generated?: boolean
          participant_id?: string | null
          timestamp?: string
          confidence_score?: number | null
          attachments?: string[] | null
          metadata?: Json | null
        }
      }
      
      // Knowledge articles table
      knowledge_articles: {
        Row: {
          id: string
          title: string
          content: string
          article_type: "diagnostic_procedure" | "common_issue" | "parts_guide" | "safety_info"
          vehicle_makes: string[]
          vehicle_years: string | null
          diagnostic_codes: string[]
          tags: string[]
          created_by: string
          created_at: string
          updated_at: string
          view_count: number
          helpfulness_rating: number | null
          supabase_article_id: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          article_type: "diagnostic_procedure" | "common_issue" | "parts_guide" | "safety_info"
          vehicle_makes: string[]
          vehicle_years?: string | null
          diagnostic_codes?: string[]
          tags?: string[]
          created_by: string
          created_at?: string
          updated_at?: string
          view_count?: number
          helpfulness_rating?: number | null
          supabase_article_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          article_type?: "diagnostic_procedure" | "common_issue" | "parts_guide" | "safety_info"
          vehicle_makes?: string[]
          vehicle_years?: string | null
          diagnostic_codes?: string[]
          tags?: string[]
          created_by?: string
          created_at?: string
          updated_at?: string
          view_count?: number
          helpfulness_rating?: number | null
          supabase_article_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "customer" | "technician" | "supervisor" | "admin"
      ticket_status: "new" | "in_progress" | "waiting_customer" | "waiting_parts" | "ready_for_pickup" | "resolved" | "closed"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      conversation_type: "voice_call" | "chat_message" | "photo_upload" | "internal_note" | "ai_analysis" | "system_event"
      article_type: "diagnostic_procedure" | "common_issue" | "parts_guide" | "safety_info"
      fuel_type: "regular_gasoline" | "premium_gasoline" | "diesel" | "hybrid" | "electric" | "flex_fuel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}