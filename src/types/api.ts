import type { JSONData } from './index'
import type { Vehicle, MotorComVehicleData } from './automotive'
import type { FileAttachment, TranscriptionResult, ChatSource } from './chat'

// Base API response structure
export interface BaseApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status: number
  timestamp?: string
}

// Success response
export interface SuccessResponse<T = any> extends BaseApiResponse<T> {
  data: T
  status: 200 | 201
}

// Error response
export interface ErrorResponse extends BaseApiResponse {
  error: string
  status: 400 | 401 | 403 | 404 | 500
  details?: string
}

// Pagination response
export interface PaginatedApiResponse<T = any> extends BaseApiResponse<T[]> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

// OpenAI Whisper API types
export interface WhisperTranscriptionRequest {
  audio: Blob | File
  model?: string
  language?: string
  temperature?: number
}

export interface WhisperTranscriptionResponse {
  text: string
  language?: string
  duration?: number
}

// n8n Webhook types
export interface N8nWebhookRequest {
  text?: string
  voice?: Blob
  files?: FileAttachment[]
  timestamp: string
  sessionId: string
  source?: ChatSource
  context?: JSONData
}

export interface N8nWebhookResponse {
  response: string
  confidence?: number
  sources?: string[]
  metadata?: JSONData
}

// Motor.com API types
export interface MotorComApiRequest {
  vin?: string
  year?: number
  make?: string
  model?: string
  trim?: string
}

export interface MotorComApiResponse {
  success: boolean
  data?: MotorComVehicleData
  error?: string
  message?: string
}

// Vehicle search API types
export interface VehicleSearchRequest {
  query?: string
  vin?: string
  year?: number
  make?: string
  model?: string
  limit?: number
  offset?: number
}

export interface VehicleSearchResponse extends PaginatedApiResponse<Vehicle> {
  suggestions?: string[]
}

// File upload API types
export interface FileUploadRequest {
  file: File
  type?: "image" | "document" | "audio" | "video"
  context?: "chat" | "ticket" | "knowledge_base"
  metadata?: JSONData
}

export interface FileUploadResponse extends BaseApiResponse {
  data: {
    id: string
    url: string
    filename: string
    size: number
    type: string
    metadata?: JSONData
  }
}

// OCR API types
export interface OCRRequest {
  image: File | Blob | string // File, blob, or base64
  type?: "vin" | "document" | "general"
  language?: string
}

export interface OCRResponse extends BaseApiResponse {
  data: {
    text: string
    confidence: number
    bounding_boxes?: Array<{
      text: string
      confidence: number
      coordinates: [number, number, number, number]
    }>
    extracted_data?: {
      vin?: string
      license_plate?: string
      [key: string]: any
    }
  }
}

// Chat API types
export interface ChatMessageRequest {
  message: string
  session_id?: string
  source?: ChatSource
  attachments?: FileAttachment[]
  voice_blob?: Blob
  context?: JSONData
}

export interface ChatMessageResponse extends BaseApiResponse {
  data: {
    response: string
    ai_provider?: "openai" | "claude"
    confidence_score?: number
    session_id: string
    message_id: string
    sources?: string[]
    metadata?: JSONData
  }
}

// Transcription API types
export interface TranscriptionRequest {
  audio: File | Blob
  language?: string
  model?: "whisper-1"
}

export interface TranscriptionResponse extends BaseApiResponse<TranscriptionResult> {
  data: TranscriptionResult
}

// Knowledge base API types
export interface KnowledgeSearchRequest {
  query: string
  filters?: {
    vehicle_makes?: string[]
    article_type?: string[]
    tags?: string[]
  }
  limit?: number
  similarity_threshold?: number
}

export interface KnowledgeSearchResponse extends BaseApiResponse {
  data: {
    articles: Array<{
      id: string
      title: string
      content: string
      similarity_score: number
      metadata: JSONData
    }>
    total_results: number
  }
}

// Document processing API types
export interface DocumentProcessingRequest {
  file: File
  type?: "pdf" | "docx" | "txt" | "md"
  extract_text?: boolean
  create_embeddings?: boolean
  metadata?: JSONData
}

export interface DocumentProcessingResponse extends BaseApiResponse {
  data: {
    id: string
    filename: string
    text_content?: string
    page_count?: number
    word_count?: number
    processing_status: "pending" | "processing" | "completed" | "failed"
    embeddings_created?: boolean
    metadata?: JSONData
  }
}

// Analytics API types
export interface AnalyticsRequest {
  metric: "chat_usage" | "ticket_volume" | "ai_performance" | "user_activity"
  date_range: {
    start: string
    end: string
  }
  filters?: {
    user_id?: string
    location_id?: string
    ticket_status?: string[]
    ai_provider?: string[]
  }
  granularity?: "hour" | "day" | "week" | "month"
}

export interface AnalyticsResponse extends BaseApiResponse {
  data: {
    metric: string
    data_points: Array<{
      timestamp: string
      value: number
      metadata?: JSONData
    }>
    summary: {
      total: number
      average: number
      peak: number
      trend: "up" | "down" | "stable"
    }
  }
}

// User management API types
export interface UserCreateRequest {
  email: string
  password: string
  full_name?: string
  role?: "customer" | "technician" | "supervisor" | "admin"
  company_name?: string
  phone?: string
}

export interface UserUpdateRequest {
  full_name?: string
  role?: "customer" | "technician" | "supervisor" | "admin"
  company_name?: string
  phone?: string
  active?: boolean
}

export interface UserResponse extends BaseApiResponse {
  data: {
    id: string
    email: string
    full_name: string | null
    role: "customer" | "technician" | "supervisor" | "admin"
    company_name: string | null
    phone: string | null
    created_at: string
    updated_at: string
  }
}

// Webhook configuration types
export interface WebhookConfig {
  url: string
  events: string[]
  secret?: string
  active: boolean
  retry_config?: {
    max_retries: number
    retry_delay_ms: number
  }
}

export interface WebhookEventPayload {
  event: string
  timestamp: string
  data: JSONData
  webhook_id: string
}

// Rate limiting types
export interface RateLimitConfig {
  requests_per_minute: number
  requests_per_hour: number
  requests_per_day: number
  burst_limit: number
}

export interface RateLimitStatus {
  remaining: number
  reset_time: string
  limit: number
  used: number
}