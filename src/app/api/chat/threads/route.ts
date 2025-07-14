import { NextRequest, NextResponse } from 'next/server'
import { serverDb } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Get all threads for the user
    const threads = await serverDb.getUserThreads(userId)

    return NextResponse.json({
      success: true,
      threads
    })

  } catch (error) {
    console.error('Get threads error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, initialMessage } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Create new thread
    const newThread = await serverDb.createConversationThread({
      ticket_id: null,
      interaction_type: 'chat',
      content: initialMessage || '',
      ai_response: '',
      confidence_score: 1.0,
      metadata: { 
        source: 'manual_creation', 
        user_id: userId,
        title: title || 'New Chat'
      }
    })

    return NextResponse.json({
      success: true,
      thread: newThread
    })

  } catch (error) {
    console.error('Create thread error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}