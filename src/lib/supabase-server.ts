import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Server-side Supabase client with service role for API routes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase server environment variables')
}

// Create server-side client with service role key (bypasses RLS)
export const supabaseServer = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Server-side database operations
export const serverDb = {
  // Chat operations
  async createChatMessage(data: Database['public']['Tables']['chat_messages']['Insert']) {
    const { data: result, error } = await supabaseServer
      .from('chat_messages')
      .insert(data)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating chat message:', error)
      throw error
    }
    
    return result
  },

  async getThreadMessages(threadId: string) {
    const { data, error } = await supabaseServer
      .from('chat_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching thread messages:', error)
      throw error
    }
    
    return data
  },

  async createConversationThread(data: Database['public']['Tables']['conversation_threads']['Insert']) {
    const { data: result, error } = await supabaseServer
      .from('conversation_threads')
      .insert(data)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating conversation thread:', error)
      throw error
    }
    
    return result
  },

  async getUserThreads(userId: string) {
    const { data, error } = await supabaseServer
      .from('conversation_threads')
      .select('*')
      .filter('metadata->user_id', 'eq', userId)
      .order('timestamp', { ascending: false })
    
    if (error) {
      console.error('Error fetching user threads:', error)
      throw error
    }
    
    return data
  },

  async getProfile(userId: string) {
    const { data, error } = await supabaseServer
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
    
    return data
  },

  async searchKnowledgeBase(query: string, limit = 5) {
    const { data, error } = await supabaseServer
      .from('knowledge_base')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.ilike.%${query}%`)
      .limit(limit)
    
    if (error) {
      console.error('Error searching knowledge base:', error)
      throw error
    }
    
    return data
  }
}

export default supabaseServer