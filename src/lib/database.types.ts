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
      chat_messages: {
        Row: {
          id: string
          thread_id: string
          sender_id: string
          role: string
          content: string
          message_type: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          sender_id: string
          role: string
          content: string
          message_type: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          sender_id?: string
          role?: string
          content?: string
          message_type?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      conversation_threads: {
        Row: {
          id: string
          ticket_id: string | null
          interaction_type: string
          content: string
          ai_response: string
          timestamp: string
          confidence_score: number
          metadata: Json | null
        }
        Insert: {
          id?: string
          ticket_id?: string | null
          interaction_type: string
          content: string
          ai_response: string
          timestamp?: string
          confidence_score: number
          metadata?: Json | null
        }
        Update: {
          id?: string
          ticket_id?: string | null
          interaction_type?: string
          content?: string
          ai_response?: string
          timestamp?: string
          confidence_score?: number
          metadata?: Json | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: "customer" | "technician" | "supervisor" | "admin"
          company_name: string | null
          phone: string | null
          avatar_url: string | null
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
          avatar_url?: string | null
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
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          ticket_number: string
          customer_phone: string
          customer_name: string
          vehicle_info: string
          vin: string
          issue_summary: string
          call_transcript: string
          ai_analysis: string
          priority: string
          status: string
          assigned_technician: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ticket_number: string
          customer_phone: string
          customer_name: string
          vehicle_info: string
          vin: string
          issue_summary: string
          call_transcript: string
          ai_analysis: string
          priority: string
          status: string
          assigned_technician: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ticket_number?: string
          customer_phone?: string
          customer_name?: string
          vehicle_info?: string
          vin?: string
          issue_summary?: string
          call_transcript?: string
          ai_analysis?: string
          priority?: string
          status?: string
          assigned_technician?: string
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_base: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          vehicle_context: string
          tags: string
          embedding: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category: string
          vehicle_context: string
          tags: string
          embedding: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string
          vehicle_context?: string
          tags?: string
          embedding?: string
          created_at?: string
          updated_at?: string
        }
      }
      retrieval_logs: {
        Row: {
          id: string
          thread_id: string
          query_text: string
          source_type: string
          result_ids: string
          returned_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          query_text: string
          source_type: string
          result_ids: string
          returned_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          query_text?: string
          source_type?: string
          result_ids?: string
          returned_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          year: string
          make: string
          model: string
          submodel: string
          engine_size: string
          cam_type: string
          body: string
          drive_type: string
        }
        Insert: {
          id?: string
          year: string
          make: string
          model: string
          submodel: string
          engine_size: string
          cam_type: string
          body: string
          drive_type: string
        }
        Update: {
          id?: string
          year?: string
          make?: string
          model?: string
          submodel?: string
          engine_size?: string
          cam_type?: string
          body?: string
          drive_type?: string
        }
      }
      tickets: {
        Row: {
          id: string
          title: string
          description: string
          status: string
          priority: string
          customer_id: string
          assigned_technician_id: string
          created_at: string
          updated_at: string
          resolved_at: string | null
          vehicle_make: string
          vehicle_model: string
          vehicle_year: string
          vin: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status: string
          priority: string
          customer_id: string
          assigned_technician_id: string
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          vehicle_make: string
          vehicle_model: string
          vehicle_year: string
          vin: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: string
          priority?: string
          customer_id?: string
          assigned_technician_id?: string
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          vehicle_make?: string
          vehicle_model?: string
          vehicle_year?: string
          vin?: string
        }
      }
      work_orders: {
        Row: {
          id: string
          ticket_id: string
          work_order_number: string
          description: string
          estimated_hours: number
          actual_hours: number
          parts_needed: string
          labor_cost: number
          parts_cost: number
          total_cost: number
          status: string
          assigned_technician: string
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          ticket_id: string
          work_order_number: string
          description: string
          estimated_hours: number
          actual_hours: number
          parts_needed: string
          labor_cost: number
          parts_cost: number
          total_cost: number
          status: string
          assigned_technician: string
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          ticket_id?: string
          work_order_number?: string
          description?: string
          estimated_hours?: number
          actual_hours?: number
          parts_needed?: string
          labor_cost?: number
          parts_cost?: number
          total_cost?: number
          status?: string
          assigned_technician?: string
          created_at?: string
          completed_at?: string | null
        }
      }
      relationships: {
        Row: {
          id: string
          source_entity_id: string
          target_entity_id: string
          relationship_type: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          source_entity_id: string
          target_entity_id: string
          relationship_type: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          source_entity_id?: string
          target_entity_id?: string
          relationship_type?: string
          metadata?: Json | null
          created_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}