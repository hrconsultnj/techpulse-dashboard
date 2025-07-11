import type { User as SupabaseUser } from '@supabase/supabase-js'

// Extended user interface
export interface User extends SupabaseUser {
  id: string
  email: string
}

// User profile from database
export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  company_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

// User roles for automotive platform
export type UserRole = "customer" | "technician" | "supervisor" | "admin"

// Authentication state
export interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

// Login form data
export interface LoginCredentials {
  email: string
  password: string
}

// Registration form data
export interface RegisterData extends LoginCredentials {
  full_name?: string
  role?: UserRole
  company_name?: string
  phone?: string
}

// Password reset data
export interface PasswordResetData {
  email: string
}

// Password update data
export interface PasswordUpdateData {
  password: string
  confirmPassword: string
}

// Authentication context type
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  resetPassword: (data: PasswordResetData) => Promise<void>
  updatePassword: (data: PasswordUpdateData) => Promise<void>
}

// Session data
export interface Session {
  user: User
  profile: UserProfile
  access_token: string
  refresh_token: string
  expires_at: number
}