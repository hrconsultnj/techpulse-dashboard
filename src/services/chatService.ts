// Chat service for database API integration
export interface ChatMessage {
  id: string
  thread_id: string
  sender_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  message_type: string
  metadata?: any
  created_at: string
  updated_at: string
}

export interface ChatThread {
  id: string
  user_id: string
  title: string
  interaction_type: string
  content: string
  ai_response: string
  timestamp: string
  confidence_score: number
  metadata?: any
}

export interface SendMessageRequest {
  message: string
  threadId?: string
  userId: string
  voiceBlob?: Blob
  attachments?: any[]
}

export interface SendMessageResponse {
  success: boolean
  threadId: string
  userMessage: ChatMessage
  assistantMessage: ChatMessage
  response: string
}

export const chatService = {
  // Send a message and get AI response
  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    const formData = new FormData()
    
    // Add message data
    formData.append('message', data.message)
    formData.append('userId', data.userId)
    
    if (data.threadId) {
      formData.append('threadId', data.threadId)
    }
    
    // Add voice blob if present
    if (data.voiceBlob) {
      formData.append('voice', data.voiceBlob, 'recording.mp3')
    }
    
    // Add attachments if present
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((attachment, index) => {
        formData.append(`attachment_${index}`, attachment.file)
      })
    }
    
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: data.message,
        threadId: data.threadId,
        userId: data.userId,
        metadata: {
          hasVoice: !!data.voiceBlob,
          attachments: data.attachments?.length || 0
        }
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  },

  // Get all threads for a user
  async getThreads(userId: string): Promise<ChatThread[]> {
    const response = await fetch(`/api/chat/threads?userId=${userId}`)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.threads || []
  },

  // Get messages for a specific thread
  async getThreadMessages(threadId: string): Promise<ChatMessage[]> {
    const response = await fetch(`/api/chat/threads/${threadId}`)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.messages || []
  },

  // Create a new thread
  async createThread(userId: string, title?: string, initialMessage?: string): Promise<ChatThread> {
    const response = await fetch('/api/chat/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        title: title || 'New Chat',
        initialMessage: initialMessage || ''
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.thread
  },

  // Delete a thread
  async deleteThread(threadId: string): Promise<void> {
    const response = await fetch(`/api/chat/threads/${threadId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
  }
}

export default chatService