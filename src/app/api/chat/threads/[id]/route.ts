import { NextRequest, NextResponse } from 'next/server'
import { serverDb, supabaseServer } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const threadId = params.id

    if (!threadId) {
      return NextResponse.json(
        { error: 'Thread ID is required' },
        { status: 400 }
      )
    }

    // Get all messages in the thread
    const messages = await serverDb.getThreadMessages(threadId)

    return NextResponse.json({
      success: true,
      messages
    })

  } catch (error) {
    console.error('Get thread messages error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const threadId = params.id

    if (!threadId) {
      return NextResponse.json(
        { error: 'Thread ID is required' },
        { status: 400 }
      )
    }

    // Delete all messages in the thread first
    await supabaseServer
      .from('chat_messages')
      .delete()
      .eq('thread_id', threadId)

    // Then delete the thread
    await supabaseServer
      .from('conversation_threads')
      .delete()
      .eq('id', threadId)

    return NextResponse.json({
      success: true,
      message: 'Thread deleted successfully'
    })

  } catch (error) {
    console.error('Delete thread error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}