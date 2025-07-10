import type { JSONData } from './index'

// File attachment interface
export interface FileAttachment {
  name: string
  type: string
  size: number
  file: File
  url?: string // For uploaded files stored in Supabase Storage
}

// Chat message interface
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  attachments?: FileAttachment[]
  hasVoice?: boolean
  ai_provider?: "openai" | "claude"
  confidence_score?: number
  metadata?: JSONData
}

// Chat session interface
export interface ChatSession {
  id: string
  user_id: string
  messages: ChatMessage[]
  created_at: string
  updated_at: string
  status: "active" | "closed" | "archived"
  title?: string
}

// Voice transcription result
export interface TranscriptionResult {
  text: string
  language?: string
  duration?: number
  confidence?: number
}

// Voice recording state
export interface VoiceRecordingState {
  isRecording: boolean
  recordingTime: number
  blob: Blob | null
  state: "idle" | "recording" | "ready" | "processing"
}

// Chat source types (from imported assets)
export type ChatSource = "web-app" | "mobile-app" | "sms" | "voice-ai" | "dashboard" | "widget" | "api" | "phone-call"

// Rate limiting configuration
export interface RateLimit {
  maxMessages: number
  timeWindowMs: number
  burstLimit: number
}

// Chat source profile (from imported assets)
export interface ChatSourceProfile {
  source: ChatSource
  displayName: string
  description: string

  // Technical Capabilities
  capabilities: {
    voice: boolean
    fileUpload: boolean
    realTimeChat: boolean
    richMedia: boolean
    location: boolean
    camera: boolean
    multiModal: boolean
    pushNotifications: boolean
    offlineSupport: boolean
  }

  // Limitations & Constraints
  limitations: {
    messageLength: number
    fileSize: number // in MB
    sessionDuration: number // in minutes
    rateLimiting: RateLimit
    supportedFileTypes: string[]
  }

  // AI Response Configuration
  aiInstructions: {
    responseStyle: "conversational" | "professional" | "concise" | "technical" | "friendly"
    maxResponseLength: number
    technicalLevel: "basic" | "intermediate" | "advanced"
    includeEmojis: boolean
    includeFormatting: boolean
    prioritizeSpeed: boolean
    contextAwareness: "minimal" | "standard" | "enhanced"
  }

  // User Experience
  userExperience: {
    expectedResponseTime: number // in seconds
    typingIndicators: boolean
    readReceipts: boolean
    messageHistory: boolean
    searchCapability: boolean
  }

  // Security & Privacy
  security: {
    requireAuth: boolean
    encryptMessages: boolean
    logConversations: boolean
    allowAnonymous: boolean
    dataRetention: "none" | "session" | "temporary" | "permanent"
  }
}

// Chat context interface
export interface ChatContextType {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string, attachments?: FileAttachment[], voiceBlob?: Blob) => Promise<void>
  transcribeAudio: (audioBlob: Blob) => Promise<string | null>
  clearMessages: () => void
  loadChatHistory: (sessionId?: string) => Promise<void>
}

// n8n webhook payload
export interface WebhookPayload {
  text?: string
  voice?: Blob
  files?: FileAttachment[]
  timestamp: string
  sessionId: string
  source?: ChatSource
  context?: JSONData
}

// AI response interface
export interface AIResponse {
  response: string
  confidence?: number
  sources?: string[]
  metadata?: JSONData
}