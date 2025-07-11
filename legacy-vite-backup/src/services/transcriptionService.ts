
interface TranscriptionResult {
  text: string
  language?: string
  duration?: number
  confidence?: number
}

interface TranscriptionError {
  error: string
  details?: string
}

class TranscriptionService {
  private readonly maxFileSize = 25 * 1024 * 1024 // 25MB limit for OpenAI Whisper
  private readonly supportedFormats = [
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm', 
    'audio/ogg', 'audio/m4a', 'audio/mp4'
  ]

  validateAudioFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No audio file provided' }
    }

    if (file.size > this.maxFileSize) {
      return { 
        valid: false, 
        error: `File size too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB` 
      }
    }

    // Check if the file type matches any supported format (handle codec variants)
    const baseType = file.type.split(';')[0] // Remove codec part
    const isSupported = this.supportedFormats.some(format => 
      format === file.type || format === baseType
    )

    if (!isSupported) {
      console.log('File type:', file.type, 'Base type:', baseType, 'Supported:', this.supportedFormats)
      return { 
        valid: false, 
        error: `Unsupported file format: ${file.type}. Supported formats: ${this.supportedFormats.join(', ')}` 
      }
    }

    return { valid: true }
  }

  async transcribeAudio(audioFile: File): Promise<TranscriptionResult> {
    const validation = this.validateAudioFile(audioFile)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    console.log('🎤 Transcribing audio file:', audioFile.name, audioFile.type, audioFile.size, 'bytes')

    try {
      // Always use real OpenAI Whisper API
      return await this.callOpenAIAPI(audioFile)
    } catch (error) {
      console.error('Transcription service error:', error)
      throw error instanceof Error ? error : new Error('Unknown transcription error')
    }
  }


  private async callOpenAIAPI(audioFile: File): Promise<TranscriptionResult> {
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured. Set VITE_OPENAI_API_KEY in your .env file.')
    }

    const formData = new FormData()
    formData.append('file', audioFile)
    formData.append('model', 'whisper-1')
    formData.append('language', 'en')
    formData.append('temperature', '0.2')
    
    console.log('🌐 Calling OpenAI Whisper API with file:', audioFile.name, `(${(audioFile.size / 1024).toFixed(1)}KB)`)
    
    const startTime = Date.now()
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    })
    
    const duration = Date.now() - startTime
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ OpenAI API error:', response.status, errorText)
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`)
    }
    
    const result = await response.json()
    console.log(`✅ OpenAI transcription completed in ${duration}ms:`, result.text.substring(0, 50) + '...')
    
    return {
      text: result.text,
      language: result.language,
      duration: result.duration,
      confidence: 1.0
    }
  }

  async transcribeBlob(audioBlob: Blob, filename = 'recording.webm'): Promise<TranscriptionResult> {
    const file = new File([audioBlob], filename, { 
      type: audioBlob.type || 'audio/webm' 
    })
    
    return this.transcribeAudio(file)
  }

  async getServiceStatus(): Promise<{ active: boolean; model?: string }> {
    return { active: true, model: 'whisper-1' }
  }
}

export const transcriptionService = new TranscriptionService()
export type { TranscriptionResult, TranscriptionError }