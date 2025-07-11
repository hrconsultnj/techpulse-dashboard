import { useState, useRef, useCallback } from 'react'
import { transcriptionService } from '@/services/transcriptionService'

interface AudioRecordingState {
  isRecording: boolean
  isPaused: boolean
  isTranscribing: boolean
  duration: number
  audioBlob: Blob | null
  transcriptionText: string
  error: string | null
}

interface AudioRecordingControls {
  startRecording: () => Promise<void>
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  clearRecording: () => void
  transcribeRecording: () => Promise<string | null>
  downloadRecording: () => void
}

export function useAudioRecording(): AudioRecordingState & AudioRecordingControls {
  const [state, setState] = useState<AudioRecordingState>({
    isRecording: false,
    isPaused: false,
    isTranscribing: false,
    duration: 0,
    audioBlob: null,
    transcriptionText: '',
    error: null
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const updateError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  const updateDuration = useCallback(() => {
    if (startTimeRef.current) {
      const elapsed = Date.now() - startTimeRef.current
      setState(prev => ({ ...prev, duration: Math.floor(elapsed / 1000) }))
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      updateError(null)
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      })
      
      streamRef.current = stream
      audioChunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      })

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType || 'audio/webm' 
        })
        
        setState(prev => ({ 
          ...prev, 
          audioBlob,
          isRecording: false,
          isPaused: false
        }))

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }

      mediaRecorder.start(100) // Record in 100ms chunks
      startTimeRef.current = Date.now()
      
      setState(prev => ({ 
        ...prev, 
        isRecording: true, 
        isPaused: false,
        duration: 0,
        audioBlob: null,
        transcriptionText: ''
      }))

      // Start duration timer
      intervalRef.current = setInterval(updateDuration, 1000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording'
      updateError(errorMessage)
      console.error('Recording error:', error)
    }
  }, [updateError, updateDuration])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop()
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.isRecording])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && !state.isPaused) {
      mediaRecorderRef.current.pause()
      setState(prev => ({ ...prev, isPaused: true }))
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.isRecording, state.isPaused])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && state.isPaused) {
      mediaRecorderRef.current.resume()
      setState(prev => ({ ...prev, isPaused: false }))
      
      // Resume duration timer
      startTimeRef.current = Date.now() - (state.duration * 1000)
      intervalRef.current = setInterval(updateDuration, 1000)
    }
  }, [state.isRecording, state.isPaused, state.duration, updateDuration])

  const clearRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setState(prev => ({
      ...prev,
      audioBlob: null,
      transcriptionText: '',
      duration: 0,
      error: null
    }))

    audioChunksRef.current = []
  }, [])

  const transcribeRecording = useCallback(async (): Promise<string | null> => {
    if (!state.audioBlob) {
      updateError('No recording available to transcribe')
      return null
    }

    try {
      setState(prev => ({ ...prev, isTranscribing: true, error: null }))

      const result = await transcriptionService.transcribeBlob(state.audioBlob)
      
      setState(prev => ({ 
        ...prev, 
        transcriptionText: result.text,
        isTranscribing: false
      }))

      return result.text
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transcription failed'
      setState(prev => ({ 
        ...prev, 
        isTranscribing: false,
        error: errorMessage
      }))
      return null
    }
  }, [state.audioBlob, updateError])

  const downloadRecording = useCallback(() => {
    if (!state.audioBlob) {
      updateError('No recording available to download')
      return
    }

    const url = URL.createObjectURL(state.audioBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recording-${new Date().toISOString().slice(0, 19)}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [state.audioBlob, updateError])

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    transcribeRecording,
    downloadRecording
  }
}