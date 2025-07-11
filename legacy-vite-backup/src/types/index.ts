// Main type definitions export file
// Re-export all types for easy importing
export * from './auth'
export * from './database'
export * from './chat'
export * from './automotive'
export * from './ui'
export * from './api'

// Common utility types
export type UUID = string
export type Timestamp = string
export type JSONData = Record<string, any>

// API Response wrapper
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status: number
}

// Component props base
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Common loading states
export interface LoadingState {
  loading: boolean
  error: string | null
}

// Common pagination
export interface PaginationParams {
  page: number
  limit: number
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}