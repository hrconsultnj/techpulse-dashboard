import { NextRequest, NextResponse } from 'next/server'
import { serverDb, supabaseServer } from '@/lib/supabase-server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, threadId, userId } = body

    // Validate required fields
    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and userId are required' },
        { status: 400 }
      )
    }

    // Create or get thread
    let currentThreadId = threadId
    if (!currentThreadId) {
      // Create new thread
      const newThread = await serverDb.createConversationThread({
        ticket_id: null,
        interaction_type: 'chat',
        content: message,
        ai_response: '', // Will be updated after AI response
        confidence_score: 0.9,
        metadata: { 
          source: 'chat_interface', 
          user_id: userId,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : '')
        }
      })
      currentThreadId = newThread.id
    }

    // Store user message
    const userMessage = await serverDb.createChatMessage({
      thread_id: currentThreadId,
      sender_id: userId,
      role: 'user',
      content: message,
      message_type: 'text',
      metadata: { timestamp: new Date().toISOString() }
    })

    // Get conversation context (last 10 messages)
    const conversationHistory = await serverDb.getThreadMessages(currentThreadId)
    
    // Search knowledge base for relevant context
    const knowledgeResults = await serverDb.searchKnowledgeBase(message)
    
    // Build context for AI
    const contextMessages = [
      {
        role: 'system' as const,
        content: `You are Synth, an automotive technical support assistant. You help with car problems, diagnostics, and repairs.
        
        Knowledge Base Context:
        ${knowledgeResults.map(kb => `- ${kb.title}: ${kb.content}`).join('\n')}
        
        Guidelines:
        - Be helpful and professional
        - Provide specific automotive advice
        - Ask clarifying questions when needed
        - Reference VIN, make, model, year when relevant
        - Suggest diagnostic steps when appropriate`
      },
      // Include recent conversation history
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ]

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: contextMessages,
      max_tokens: 1000,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    // Store AI response
    const assistantMessage = await serverDb.createChatMessage({
      thread_id: currentThreadId,
      sender_id: 'system', // AI assistant
      role: 'assistant',
      content: aiResponse,
      message_type: 'text',
      metadata: { 
        model: 'gpt-4',
        tokens: completion.usage?.total_tokens || 0,
        timestamp: new Date().toISOString()
      }
    })

    // Update thread with latest AI response
    await supabaseServer
      .from('conversation_threads')
      .update({
        ai_response: aiResponse,
        timestamp: new Date().toISOString(),
        confidence_score: 0.9
      })
      .eq('id', currentThreadId)

    return NextResponse.json({
      success: true,
      threadId: currentThreadId,
      userMessage,
      assistantMessage,
      response: aiResponse
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Chat API is working' })
}