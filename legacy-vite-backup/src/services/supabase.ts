import { createClient, type AuthChangeEvent, type Session } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Load environment variables with proper typing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.')
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

// Database query options interface
interface QueryOptions {
  columns?: string
  filters?: Array<{
    column: string
    operator: string
    value: any
  }>
  order?: {
    column: string
    ascending: boolean
  }
  limit?: number
  offset?: number
}

// Type-safe database operations
export const db = {
  // Generic function to fetch data from any table with full type safety
  async getAll<T extends keyof Database['public']['Tables']>(
    table: T,
    options: QueryOptions = {}
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
    
    return result
  },
  
  // Create multiple records
  async createMany<T extends keyof Database['public']['Tables']>(
    table: T,
    data: Database['public']['Tables'][T]['Insert'][]
  ): Promise<Database['public']['Tables'][T]['Row'][]> {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
    
    if (error) {
      console.error(`Error creating multiple ${table}:`, error)
      throw error
    }
    
    return result || []
  },
  
  // Update a record by ID
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
    
    return result
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
  
  // Count records in a table
  async count<T extends keyof Database['public']['Tables']>(
    table: T,
    filters?: QueryOptions['filters']
  ): Promise<number> {
    let query = supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    
    if (filters) {
      filters.forEach(filter => {
        query = query.filter(filter.column, filter.operator, filter.value)
      })
    }
    
    const { count, error } = await query
    
    if (error) {
      console.error(`Error counting ${table}:`, error)
      throw error
    }
    
    return count || 0
  },
  
  // Search with text matching
  async search<T extends keyof Database['public']['Tables']>(
    table: T,
    column: string,
    query: string,
    options: QueryOptions = {}
  ): Promise<Database['public']['Tables'][T]['Row'][]> {
    let searchQuery = supabase
      .from(table)
      .select(options.columns || '*')
      .textSearch(column, query)
    
    if (options.filters) {
      options.filters.forEach(filter => {
        searchQuery = searchQuery.filter(filter.column, filter.operator, filter.value)
      })
    }
    
    if (options.order) {
      searchQuery = searchQuery.order(options.order.column, { ascending: options.order.ascending })
    }
    
    if (options.limit) {
      searchQuery = searchQuery.limit(options.limit)
    }
    
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
  
  // Customer operations
  async getCustomerVehicles(customerId: string) {
    return await db.getAll('vehicles', {
      filters: [{ column: 'customer_id', operator: 'eq', value: customerId }]
    })
  },
  
  // Support ticket operations
  async getTicketsByStatus(status: Database['public']['Tables']['support_tickets']['Row']['status']) {
    return await db.getAll('support_tickets', {
      filters: [{ column: 'status', operator: 'eq', value: status }],
      order: { column: 'created_at', ascending: false }
    })
  },
  
  async getTicketsByTechnician(technicianId: string) {
    return await db.getAll('support_tickets', {
      filters: [{ column: 'assigned_technician_id', operator: 'eq', value: technicianId }],
      order: { column: 'updated_at', ascending: false }
    })
  },
  
  // Chat operations
  async getChatHistory(userId: string, sessionId?: string) {
    const filters = [{ column: 'user_id', operator: 'eq', value: userId }]
    
    if (sessionId) {
      filters.push({ column: 'session_id', operator: 'eq', value: sessionId })
    }
    
    return await db.getAll('chat_messages', {
      filters,
      order: { column: 'created_at', ascending: true }
    })
  },
  
  async saveChatMessage(
    userId: string,
    message: string,
    response?: string,
    aiProvider?: string,
    sessionId?: string,
    metadata?: any
  ) {
    return await db.create('chat_messages', {
      user_id: userId,
      message,
      response: response || null,
      ai_provider: aiProvider || null,
      session_id: sessionId || null,
      metadata: metadata || null
    })
  }
}

// Storage helpers
export const storage = {
  // Upload file to storage bucket
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) {
      console.error('Error uploading file:', error)
      throw error
    }
    
    return data
  },
  
  // Get public URL for file
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },
  
  // Delete file from storage
  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  }
}

export default supabase