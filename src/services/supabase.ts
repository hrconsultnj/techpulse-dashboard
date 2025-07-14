import { createClient, type AuthChangeEvent, type Session } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

// Load environment variables with proper typing for Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.')
}

// Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Type-safe authentication helpers
export const auth = {
  signUp: async (email: string, password: string, metadata?: Record<string, any>) => {
    return await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata
      }
    })
  },
  
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },
  
  signOut: async () => {
    return await supabase.auth.signOut()
  },
  
  getCurrentUser: async () => {
    return await supabase.auth.getUser()
  },
  
  getSession: async () => {
    return await supabase.auth.getSession()
  },
  
  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },
  
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email)
  },
  
  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({ password })
  }
}

// Database query interface with type safety
interface QueryOptions<T extends keyof Database['public']['Tables']> {
  columns?: string
  filters?: Array<{
    column: string
    operator: string
    value: any
  }>
  order?: {
    column: string
    ascending?: boolean
  }
  limit?: number
  offset?: number
}

// Generic database operations with full type safety
export const db = {
  // Get all records from a table with optional filtering and ordering
  async getAll<T extends keyof Database['public']['Tables']>(
    table: T,
    options: QueryOptions<T> = {}
  ): Promise<Database['public']['Tables'][T]['Row'][]> {
    let query = supabase.from(table).select(options.columns || '*')
    
    if (options.filters) {
      options.filters.forEach(filter => {
        query = query.filter(filter.column, filter.operator, filter.value)
      })
    }
    
    if (options.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending })
    }
    
    if (options.limit) {
      query = query.limit(options.limit)
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error(`Error fetching from ${table}:`, error)
      throw error
    }
    
    return (data || []) as unknown as Database['public']['Tables'][T]['Row'][]
  },
  
  // Get a single record by ID
  async getById<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string,
    columns?: string
  ): Promise<Database['public']['Tables'][T]['Row'] | null> {
    const { data, error } = await supabase
      .from(table)
      .select(columns || '*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null // Record not found
      }
      console.error(`Error fetching ${table} by ID:`, error)
      throw error
    }
    
    return data as unknown as Database['public']['Tables'][T]['Row'] | null
  },
  
  // Create a new record with type safety
  async create<T extends keyof Database['public']['Tables']>(
    table: T,
    data: Database['public']['Tables'][T]['Insert']
  ): Promise<Database['public']['Tables'][T]['Row']> {
    const { data: result, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single()
    
    if (error) {
      console.error(`Error creating ${table}:`, error)
      throw error
    }
    
    return result as Database['public']['Tables'][T]['Row']
  },
  
  // Update an existing record with type safety
  async update<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string,
    data: Database['public']['Tables'][T]['Update']
  ): Promise<Database['public']['Tables'][T]['Row']> {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error(`Error updating ${table}:`, error)
      throw error
    }
    
    return result as Database['public']['Tables'][T]['Row']
  },
  
  // Delete a record by ID
  async delete<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string
  ): Promise<void> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error(`Error deleting from ${table}:`, error)
      throw error
    }
  },
  
  // Generic search across text columns
  async search<T extends keyof Database['public']['Tables']>(
    table: T,
    searchTerm: string,
    columns: string[] = ['*'],
    limit = 10
  ): Promise<Database['public']['Tables'][T]['Row'][]> {
    // Build OR condition for text search
    const orConditions = columns
      .filter(col => col !== '*')
      .map(col => `${col}.ilike.%${searchTerm}%`)
      .join(',')
    
    const searchQuery = supabase
      .from(table)
      .select('*')
      .or(orConditions)
      .limit(limit)
    
    const { data, error } = await searchQuery
    
    if (error) {
      console.error(`Error searching ${table}:`, error)
      throw error
    }
    
    return (data || []) as unknown as Database['public']['Tables'][T]['Row'][]
  }
}

// Specific automotive database helpers
export const automotiveDb = {
  // Vehicle operations
  async getVehicleByVin(vin: string) {
    return await db.getById('vehicles', vin)
  },
  
  async searchVehicles(searchQuery: string, limit = 10) {
    const vehicles = await supabase
      .from('vehicles')
      .select('*')
      .or(`vin.ilike.%${searchQuery}%,make.ilike.%${searchQuery}%,model.ilike.%${searchQuery}%`)
      .limit(limit)
    
    return vehicles.data || []
  },
  
  // Support ticket operations
  async getTicketsByCustomer(customerId: string) {
    return await db.getAll('support_tickets', {
      filters: [{ column: 'customer_id', operator: 'eq', value: customerId }],
      order: { column: 'created_at', ascending: false }
    })
  },
  
  async getTicketsByTechnician(technicianId: string) {
    return await db.getAll('support_tickets', {
      filters: [{ column: 'assigned_technician_id', operator: 'eq', value: technicianId }],
      order: { column: 'created_at', ascending: false }
    })
  },
  
  // Customer operations
  async getCustomerProfile(customerId: string) {
    return await db.getById('user_profiles', customerId)
  },
  
  async getCustomerVehicles(customerId: string) {
    return await db.getAll('vehicles', {
      filters: [{ column: 'customer_id', operator: 'eq', value: customerId }]
    })
  },
  
  // Knowledge base operations
  async searchKnowledgeBase(query: string, limit = 10) {
    return await db.search('knowledge_base', query, ['title', 'content', 'tags'], limit)
  },
  
  async getKnowledgeArticlesByCategory(category: string) {
    return await db.getAll('knowledge_base', {
      filters: [{ column: 'category', operator: 'eq', value: category }],
      order: { column: 'created_at', ascending: false }
    })
  }
}

// Error types for better error handling
export class SupabaseError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message)
    this.name = 'SupabaseError'
  }
}

// Utility functions
export const utils = {
  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  },
  
  // Get current user ID
  getCurrentUserId: async (): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id || null
  },
  
  // Real-time subscriptions (simplified)
  subscribeToTable: (
    table: string,
    callback: (payload: any) => void,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
  ) => {
    // Real-time subscriptions can be implemented later when needed
    console.log('Real-time subscriptions not implemented yet')
    return { unsubscribe: () => {} }
  }
}

export default supabase