import type { JSONData, UUID, Timestamp } from './index'

// Vehicle fuel types
export type VehicleFuelType = 
  | "regular_gasoline"
  | "premium_gasoline" 
  | "diesel"
  | "hybrid"
  | "electric"
  | "flex_fuel"

// Vehicle interface
export interface Vehicle {
  vin: string
  year: number
  make: string
  model: string
  trim?: string
  engine_type?: string
  transmission?: string
  fuel_type?: VehicleFuelType
  mileage?: number
  color?: string
  license_plate?: string
  customer_id?: string
  vehicle_data?: JSONData // Full vehicle specs from Motor.com
  created_at: Timestamp
  updated_at: Timestamp
  last_service_date?: Timestamp
}

// Customer interface
export interface Customer {
  id: UUID
  first_name: string
  last_name: string
  email?: string
  phone?: string
  address?: string
  company_id?: UUID
  location_id?: UUID
  vehicles: Vehicle[]
  created_at: Timestamp
  updated_at: Timestamp
  notes?: string
}

// Support ticket statuses
export type TicketStatus = 
  | "new"
  | "in_progress" 
  | "waiting_customer"
  | "waiting_parts"
  | "ready_for_pickup"
  | "resolved"
  | "closed"

// Support ticket priorities
export type TicketPriority = "low" | "medium" | "high" | "urgent"

// Issue categories
export type IssueCategory = 
  | "engine"
  | "transmission"
  | "electrical"
  | "brakes"
  | "suspension"
  | "ac_heating"
  | "diagnostic_codes"
  | "maintenance"
  | "other"

// Support ticket interface
export interface SupportTicket {
  id: UUID
  ticket_number: string
  customer_id: UUID
  vehicle_vin?: string
  assigned_technician_id?: UUID
  assigned_support_agent_id?: UUID
  location_id?: UUID
  status: TicketStatus
  priority: TicketPriority
  category?: IssueCategory
  issue_summary: string
  detailed_description?: string
  ai_analysis?: JSONData
  ai_confidence_score?: number
  resolution_notes?: string
  created_at: Timestamp
  updated_at: Timestamp
  resolved_at?: Timestamp
  estimated_hours?: number
  actual_hours?: number
  customer_satisfaction?: number // 1-5 rating
}

// Conversation thread types
export type ConversationType = 
  | "voice_call"
  | "chat_message"
  | "photo_upload"
  | "internal_note"
  | "ai_analysis"
  | "system_event"

// Conversation thread interface
export interface ConversationThread {
  id: UUID
  support_ticket_id: UUID
  thread_id: string
  conversation_type: ConversationType
  content: string
  ai_generated: boolean
  participant_id?: UUID // User who spoke/wrote this
  timestamp: Timestamp
  confidence_score?: number // For AI-generated content
  attachments?: string[] // File URLs
  metadata?: JSONData // Call duration, etc.
}

// Photo attachment types
export type ImageType = "vin_photo" | "diagnostic_image" | "parts_photo" | "other"

// Photo attachment interface
export interface PhotoAttachment {
  id: UUID
  support_ticket_id: UUID
  conversation_thread_id?: UUID
  image_url: string
  image_type: ImageType
  extracted_text?: string // OCR results
  ai_analysis?: string // What AI sees in the image
  uploaded_by: UUID
  uploaded_at: Timestamp
}

// Company/tenant interface
export interface Company {
  id: UUID
  name: string
  slug: string
  active: boolean
  plan_type: "basic" | "professional" | "enterprise"
  created_date: Timestamp
  contact_email: string
  phone?: string
  address?: string
  logo_url?: string
  settings?: JSONData
}

// Location interface
export interface Location {
  id: UUID
  name: string
  company_id: UUID
  address?: string
  phone?: string
  manager_id?: UUID
  active: boolean
  timezone?: string
  business_hours?: JSONData
}

// AI session interface
export interface AISession {
  id: UUID
  session_id: string
  support_ticket_id: UUID
  ai_agent_type: "voice_assistant" | "chat_bot" | "diagnostic_ai"
  session_start: Timestamp
  session_end?: Timestamp
  total_interactions: number
  escalated_to_human: boolean
  escalation_reason?: string
  performance_score?: number // 1-5
  raw_session_data?: JSONData
}

// Knowledge article interface
export interface KnowledgeArticle {
  id: UUID
  title: string
  content: string
  article_type: "diagnostic_procedure" | "common_issue" | "parts_guide" | "safety_info"
  vehicle_makes: string[] // Honda, Toyota, etc.
  vehicle_years?: string // 2015-2020
  diagnostic_codes: string[] // P0420, P0171, etc.
  tags: string[]
  created_by: UUID
  created_at: Timestamp
  updated_at: Timestamp
  view_count: number
  helpfulness_rating?: number // 1-5
  supabase_article_id?: string // Link to Supabase vector storage
}

// Vehicle lookup/search interface
export interface VehicleSearchParams {
  vin?: string
  year?: number
  make?: string
  model?: string
  trim?: string
}

// Motor.com API response
export interface MotorComVehicleData {
  vin: string
  year: number
  make: string
  model: string
  trim: string
  engine: string
  transmission: string
  drivetrain: string
  fuel_type: string
  body_style: string
  doors: number
  cylinders: number
  displacement: string
  horsepower: number
  torque: number
  city_mpg: number
  highway_mpg: number
  combined_mpg: number
  msrp: number
  specifications: JSONData
}