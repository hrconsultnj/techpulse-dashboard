export async function POST(req: Request) {
  try {
    console.log("=== Transcription API Called ===")

    // Get OpenAI API key from server environment (SECURE!)
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.error("OpenAI API key not configured in server environment")
      return Response.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const formData = await req.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return Response.json({ error: "No audio file provided" }, { status: 400 })
    }

    console.log(`Transcribing audio: ${audioFile.name} (${audioFile.size} bytes, ${audioFile.type})`)

    // Validate file size (25MB limit for OpenAI Whisper)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (audioFile.size > maxSize) {
      return Response.json({ 
        error: `File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB` 
      }, { status: 400 })
    }

    // Validate file type
    const supportedTypes = [
      'audio/webm', 'audio/mpeg', 'audio/mp3', 'audio/wav', 
      'audio/ogg', 'audio/m4a', 'audio/mp4'
    ]
    const baseType = audioFile.type.split(';')[0] // Remove codec part
    const isSupported = supportedTypes.some(type => 
      type === audioFile.type || type === baseType
    )

    if (!isSupported) {
      return Response.json({
        error: `Unsupported file format: ${audioFile.type}. Supported formats: ${supportedTypes.join(', ')}`
      }, { status: 400 })
    }

    // Create FormData for OpenAI API
    const openaiFormData = new FormData()
    openaiFormData.append('file', audioFile)
    openaiFormData.append('model', 'whisper-1')
    openaiFormData.append('language', 'en')
    openaiFormData.append('temperature', '0.2')

    console.log('🌐 Calling OpenAI Whisper API directly from Next.js API route')
    
    const startTime = Date.now()
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: openaiFormData,
    })
    
    const duration = Date.now() - startTime
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ OpenAI API error:', response.status, errorText)
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`)
    }
    
    const result = await response.json()
    console.log(`✅ Secure transcription completed in ${duration}ms:`, result.text.substring(0, 50) + '...')

    return Response.json({
      text: result.text,
      language: result.language,
      duration: result.duration,
      confidence: 1.0, // OpenAI provides high-quality results
    })
  } catch (error) {
    console.error("Transcription error:", error)

    return Response.json(
      {
        error: "Transcription failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return Response.json({
    message: "TechPulse Transcription API",
    status: "active",
    model: "whisper-1",
    secure: true, // API key is server-side only
  })
}