import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Mic,
  Paperclip,
  Send,
  X,
  FileText,
  SidebarOpenIcon,
  SidebarCloseIcon,
  Settings,
  User,
  Menu,
  Sun,
  Moon,
  Plus,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface FileAttachment {
  name: string
  type: string
  size: number
  file: File
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  attachments?: FileAttachment[]
  hasVoice?: boolean
}

export default function SynthChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)

  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "ready">("idle")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const micButtonRef = useRef<HTMLButtonElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  const handleFileUpload = useCallback((files: FileList) => {
    const newAttachments: FileAttachment[] = []

    for (const file of Array.from(files)) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf", "text/plain"]
      const maxSize = 10 * 1024 * 1024 // 10MB

      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} not allowed`)
        continue
      }

      if (file.size > maxSize) {
        alert(`File ${file.name} is too large (max 10MB)`)
        continue
      }

      newAttachments.push({
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
      })
    }

    setAttachments((prev) => [...prev, ...newAttachments])
  }, [])

  const removeAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const sendToN8n = useCallback(async (messageText: string, voiceBlob?: Blob, files?: FileAttachment[]) => {
    const formData = new FormData()

    if (messageText.trim()) {
      formData.append("text", messageText)
    }

    if (voiceBlob) {
      console.log("Adding MP3 voice blob to FormData:", voiceBlob.size, "bytes, type:", voiceBlob.type)
      formData.append("voice", voiceBlob, `recording.mp3`)
    }

    if (files && files.length > 0) {
      files.forEach((attachment, index) => {
        formData.append(`file_${index}`, attachment.file)
      })
    }

    formData.append("timestamp", new Date().toISOString())
    formData.append("sessionId", "current-session")

    try {
      // Use the proxy endpoint to avoid CORS issues
      const proxyUrl = "/api/webhook-proxy"
      console.log("Sending to webhook proxy:", proxyUrl)
      console.log("FormData contents:")

      // Log FormData contents for debugging
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes, ${value.type})`)
        } else {
          console.log(`${key}: ${value}`)
        }
      }

      const response = await fetch(proxyUrl, {
        method: "POST",
        body: formData,
      })

      console.log("Proxy response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Proxy error response:", errorText)
        throw new Error(`Proxy failed with status ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("Proxy response:", result)

      let assistantResponse = ""
      if (typeof result === "string") {
        assistantResponse = result
      } else if (result.response) {
        assistantResponse = result.response
      } else if (result.message) {
        assistantResponse = result.message
      } else if (result.data) {
        assistantResponse = typeof result.data === "string" ? result.data : JSON.stringify(result.data)
      } else {
        assistantResponse = JSON.stringify(result)
      }

      if (assistantResponse) {
        const assistantMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: assistantResponse,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Detailed webhook error:", error)

      let errorMessage = "I'm having trouble connecting right now. Please try again."

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = "Network connection failed. Please check your internet connection and try again."
      } else if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "The webhook endpoint was not found. Please check the configuration."
        } else if (error.message.includes("403") || error.message.includes("401")) {
          errorMessage = "Access denied to the webhook. Please check authentication settings."
        } else if (error.message.includes("500")) {
          errorMessage = "Server error occurred. The n8n workflow might have an issue."
        }
      }

      const errorResponse: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `${errorMessage}\n\n**Debug Info:**\n- Using webhook proxy to avoid CORS\n- Error: ${error instanceof Error ? error.message : "Unknown error"}\n- Check browser console for more details.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    }
  }, [])

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!input.trim() && attachments.length === 0 && !voiceBlob) return

      // Prevent double submission
      if (isLoading) {
        console.warn("Submission already in progress")
        return
      }

      try {
        setIsLoading(true)

        let messageContent = input
        if (!messageContent && voiceBlob) {
          messageContent = "🎤 Voice message"
        } else if (!messageContent && attachments.length > 0) {
          messageContent = `📎 ${attachments.length} file(s) attached`
        }

        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "user",
          content: messageContent,
          timestamp: new Date(),
          attachments: attachments.length > 0 ? attachments : undefined,
          hasVoice: !!voiceBlob,
        }

        setMessages((prev) => [...prev, userMessage])

        await sendToN8n(input, voiceBlob || undefined, attachments.length > 0 ? attachments : undefined)

        // Clear form
        setInput("")
        setAttachments([])
        setVoiceBlob(null)
        setRecordingState("idle")
        setRecordingTime(0)
        setTranscriptionError(null)

        if (textareaRef.current) {
          textareaRef.current.style.height = "auto"
        }
      } catch (error) {
        console.error("Submit error:", error)

        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: `Sorry, there was an error sending your message: ${error instanceof Error ? error.message : "Unknown error"}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [input, attachments, voiceBlob, sendToN8n],
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e as any)
    }
  }

  const startNewChat = useCallback(() => {
    setMessages([])
    setInput("")
    setAttachments([])
    setVoiceBlob(null)
    setRecordingState("idle")
    setRecordingTime(0)
  }, [])

  const startRecording = async () => {
    // Prevent multiple simultaneous recordings
    if (isRecording || recordingState === "recording") {
      console.warn("Recording already in progress")
      return
    }

    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support audio recording")
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        stream.getTracks().forEach((track) => track.stop())
        throw new Error("Your browser doesn't support audio recording")
      }

      let mimeType = "audio/webm;codecs=opus"
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus"
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm"
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4"
      } else {
        stream.getTracks().forEach((track) => track.stop())
        throw new Error("Your browser doesn't support the required audio formats")
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        audioBitsPerSecond: 128000,
      })
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onerror = (e) => {
        console.error("MediaRecorder error:", e)
        setRecordingState("idle")
        setIsRecording(false)
        stream.getTracks().forEach((track) => track.stop())
        alert("Recording failed. Please try again.")
      }

      recorder.onstop = async () => {
        if (chunks.length === 0) {
          console.warn("No audio data recorded")
          setRecordingState("idle")
          stream.getTracks().forEach((track) => track.stop())
          alert("No audio was recorded. Please try again.")
          return
        }

        setIsConverting(true)

        try {
          const originalBlob = new Blob(chunks, { type: mimeType })

          // Check if blob has content
          if (originalBlob.size === 0) {
            throw new Error("Recorded audio is empty")
          }

          // Simple conversion - just change the mime type for consistency
          const mp3Blob = new Blob([originalBlob], { type: "audio/mp3" })
          setVoiceBlob(mp3Blob)
          setRecordingState("ready")
          setIsConverting(false)

          // Start transcription
          const transcribedText = await transcribeAudio(mp3Blob)

          if (transcribedText && transcribedText.trim()) {
            // If there's existing text, ask user how to handle it
            if (input.trim()) {
              const userChoice = confirm(
                `Transcribed: "${transcribedText}"\n\n` +
                  "You already have text in the input field. Do you want to:\n\n" +
                  "OK = Replace the current text\n" +
                  "Cancel = Add to the current text",
              )

              if (userChoice) {
                setInput(transcribedText)
              } else {
                setInput((prev) => prev + (prev ? " " : "") + transcribedText)
              }
            } else {
              setInput(transcribedText)
            }

            // Auto-resize the textarea
            if (textareaRef.current) {
              textareaRef.current.style.height = "auto"
              textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px"
              textareaRef.current.focus()
            }
          }
        } catch (error) {
          console.error("Audio processing failed:", error)
          setIsConverting(false)
          setRecordingState("idle")
          alert(`Audio processing failed: ${error instanceof Error ? error.message : "Unknown error"}`)
        }

        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingState("recording")
      setRecordingTime(0)

      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
      ;(recorder as any).timer = timer

      // Auto-stop recording after 5 minutes to prevent issues
      setTimeout(
        () => {
          if (recorder.state === "recording") {
            console.warn("Auto-stopping recording after 5 minutes")
            stopRecording()
          }
        },
        5 * 60 * 1000,
      )
    } catch (error) {
      console.error("Recording failed:", error)
      setRecordingState("idle")
      setIsRecording(false)
      setIsConverting(false)

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          alert("Microphone access denied. Please allow microphone access in your browser settings and try again.")
        } else if (error.name === "NotFoundError") {
          alert("No microphone found. Please connect a microphone and try again.")
        } else if (error.name === "NotReadableError") {
          alert("Microphone is being used by another application. Please close other apps and try again.")
        } else {
          alert(`Recording failed: ${error.message}`)
        }
      } else {
        alert("Recording failed. Please try again.")
      }
    }
  }

  const stopRecording = () => {
    try {
      if (mediaRecorder && isRecording) {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop()
        }
        clearInterval((mediaRecorder as any).timer)
        setMediaRecorder(null)
        setIsRecording(false)
      }
    } catch (error) {
      console.error("Error stopping recording:", error)
      setRecordingState("idle")
      setIsRecording(false)
      setIsConverting(false)
    }
  }

  // Desktop: Click to start/stop, Mobile: Hold to record
  const handleMicClick = () => {
    if (isMobile) return // Mobile uses touch events

    try {
      if (recordingState === "idle") {
        // Clear any existing transcription errors
        setTranscriptionError(null)
        startRecording()
      } else if (recordingState === "recording") {
        stopRecording()
      } else if (recordingState === "ready") {
        // If there's already text, ask user what they want to do
        if (input.trim()) {
          const userChoice = confirm(
            "You already have text in the input field. Do you want to:\n\n" +
              "OK = Replace the current text with a new recording\n" +
              "Cancel = Keep the current text and record again to add to it",
          )

          if (userChoice) {
            // Replace current text - clear and start new recording
            setInput("")
            setVoiceBlob(null)
            setRecordingState("idle")
            setRecordingTime(0)
            setTimeout(() => startRecording(), 100)
          } else {
            // Keep current text - just start new recording
            setVoiceBlob(null)
            setRecordingState("idle")
            setRecordingTime(0)
            setTimeout(() => startRecording(), 100)
          }
        } else {
          // No existing text, just start new recording
          setVoiceBlob(null)
          setRecordingState("idle")
          setRecordingTime(0)
          setTimeout(() => startRecording(), 100)
        }
      }
    } catch (error) {
      console.error("Microphone click error:", error)
      setRecordingState("idle")
      setIsRecording(false)
      setIsConverting(false)
      setIsTranscribing(false)
      alert("An error occurred with the microphone. Please try again.")
    }
  }

  // Mobile touch events
  const handleMicTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return
    e.preventDefault()
    if (recordingState === "idle") {
      startRecording()
    }
  }

  const handleMicTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile) return
    e.preventDefault()
    if (recordingState === "recording") {
      stopRecording()
    }
  }

  // Get mic button color based on state
  const getMicButtonColor = () => {
    if (recordingState === "recording") {
      return "text-red-500 hover:text-red-600"
    } else {
      return "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
    }
  }

  const transcribeAudio = async (audioBlob: Blob): Promise<string | null> => {
    try {
      setIsTranscribing(true)
      setTranscriptionError(null)

      // Check if blob is valid
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error("No audio data to transcribe")
      }

      // Check blob size (limit to 25MB for OpenAI)
      if (audioBlob.size > 25 * 1024 * 1024) {
        throw new Error("Audio file too large (max 25MB)")
      }

      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.mp3")

      console.log("Sending audio for transcription...")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ details: "Unknown error" }))
        throw new Error(errorData.details || `Transcription failed with status ${response.status}`)
      }

      const result = await response.json()

      if (!result.text || typeof result.text !== "string") {
        throw new Error("Invalid transcription response")
      }

      console.log("Transcription successful:", result.text)
      return result.text.trim()
    } catch (error) {
      console.error("Transcription error:", error)

      let errorMessage = "Transcription failed"
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorMessage = "Transcription timed out"
        } else {
          errorMessage = error.message
        }
      }

      setTranscriptionError(errorMessage)
      return null
    } finally {
      setIsTranscribing(false)
    }
  }

  useEffect(() => {
    // Cleanup function to stop recording if component unmounts
    return () => {
      if (mediaRecorder && isRecording) {
        try {
          mediaRecorder.stop()
          clearInterval((mediaRecorder as any).timer)
        } catch (error) {
          console.error("Cleanup error:", error)
        }
      }
    }
  }, [mediaRecorder, isRecording])

  return (
    <div className={cn("flex h-screen", darkMode ? "dark" : "")}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-gray-900 dark:bg-gray-950 text-white transition-all duration-300 flex flex-col z-50",
          isMobile
            ? cn("fixed inset-y-0 left-0 w-80 transform", sidebarOpen ? "translate-x-0" : "-translate-x-full")
            : sidebarOpen
              ? "w-64"
              : "w-0 overflow-hidden",
        )}
      >
        <div className="p-4 border-b border-gray-700 dark:border-gray-800">
          <div className="flex justify-center mb-4">
            <img
              src="/assets-review/imported-assets/images/techpulse-logo-dark.png"
              alt="TechPulse"
              className="h-[60px] w-auto"
            />
          </div>
          <Button
            onClick={startNewChat}
            className="w-full bg-transparent border border-gray-600 hover:bg-gray-800 text-white justify-start"
          >
            <Plus className="w-4 h-4 mr-2" />
            New chat
          </Button>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-gray-800 lg:hidden mt-4"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
            <p>Chat history will appear here</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="w-4 h-4" />
              <span>TechPulse User</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {/* Header */}
        <div
          className={cn(
            "border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between",
            isMobile ? "px-4 py-3" : "",
          )}
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 dark:text-gray-400"
            >
              {isMobile ? (
                <Menu className="w-5 h-5" />
              ) : sidebarOpen ? (
                <SidebarCloseIcon className="w-5 h-5" />
              ) : (
                <SidebarOpenIcon className="w-5 h-5" />
              )}
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 p-0.5">
                <img
                  src="/assets-review/imported-assets/images/synth-headshot.png"
                  alt="Synth"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className={cn("font-semibold text-gray-900 dark:text-white", isMobile ? "text-lg" : "text-xl")}>
                  Synth
                </h1>
                {!isMobile && <p className="text-xs text-gray-500 dark:text-gray-400">TechPulse AI Assistant</p>}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 p-1 mx-auto mb-6">
                  <img
                    src="/assets-review/imported-assets/images/synth-headshot.png"
                    alt="Synth"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h2
                  className={cn("font-semibold text-gray-900 dark:text-white mb-2", isMobile ? "text-xl" : "text-2xl")}
                >
                  Hi, I'm Synth
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  I'm your automotive technical support assistant. I can help diagnose car problems, provide repair
                  guidance, and analyze images of automotive issues.
                </p>
                {isMobile && (
                  <div className="mt-6 grid grid-cols-1 gap-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">💬 Ask questions</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">🎤 Hold to record</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300 font-medium">📷 Upload images</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={cn("mx-auto px-4 py-6", isMobile ? "max-w-none" : "max-w-3xl")}>
              {messages.map((message) => (
                <div key={message.id} className={cn("mb-8", isMobile ? "mb-6" : "")}>
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "rounded-full flex items-center justify-center flex-shrink-0",
                        isMobile ? "w-8 h-8" : "w-10 h-10",
                        message.role === "user" ? "bg-blue-600" : "bg-gradient-to-r from-blue-500 to-cyan-500 p-0.5",
                      )}
                    >
                      {message.role === "user" ? (
                        <User className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
                      ) : (
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <img
                            src="/assets-review/imported-assets/images/synth-headshot.png"
                            alt="Synth"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "font-medium text-gray-900 dark:text-white mb-1",
                          isMobile ? "text-sm" : "text-sm",
                        )}
                      >
                        {message.role === "user" ? "You" : "Synth"}
                      </div>
                      <div
                        className={cn(
                          "text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap",
                          isMobile ? "text-sm" : "",
                        )}
                      >
                        {message.content}
                      </div>

                      {/* Attachments */}
                      {message.attachments?.map((attachment, index) => (
                        <div key={index} className="mt-3">
                          {attachment.type.startsWith("image/") ? (
                            <div
                              className={cn(
                                "rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                isMobile ? "max-w-full" : "max-w-sm",
                              )}
                            >
                              <img
                                src={URL.createObjectURL(attachment.file)}
                                alt={attachment.name}
                                className="object-cover w-full"
                                style={{ maxHeight: isMobile ? "200px" : "200px" }}
                              />
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700",
                                isMobile ? "max-w-full" : "max-w-sm",
                              )}
                            >
                              <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{attachment.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className={cn("mb-8", isMobile ? "mb-6" : "")}>
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "bg-gradient-to-r from-blue-500 to-cyan-500 p-0.5 rounded-full",
                        isMobile ? "w-8 h-8" : "w-10 h-10",
                      )}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src="/assets-review/imported-assets/images/synth-headshot.png"
                          alt="Synth"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div
                        className={cn(
                          "font-medium text-gray-900 dark:text-white mb-1",
                          isMobile ? "text-sm" : "text-sm",
                        )}
                      >
                        Synth
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          className={cn(
            "border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
            isMobile ? "p-3" : "p-4",
          )}
        >
          <div className={cn("mx-auto", isMobile ? "max-w-none" : "max-w-3xl")}>
            {/* Recording status - minimal inline indicator */}
            {(isRecording || isConverting || isTranscribing) && (
              <div className="mb-2 flex items-center justify-center">
                <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full border border-red-200 dark:border-red-800">
                  {isRecording ? (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-red-700 dark:text-red-300">
                        {isMobile
                          ? "Recording..."
                          : `Recording ${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, "0")}`}
                      </span>
                    </>
                  ) : isConverting ? (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-spin"></div>
                      <span className="text-xs text-yellow-700 dark:text-yellow-300">Converting to MP3...</span>
                    </>
                  ) : isTranscribing ? (
                    <>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-blue-700 dark:text-blue-300">Transcribing audio...</span>
                    </>
                  ) : null}
                </div>
              </div>
            )}

            {/* Transcription Error */}
            {transcriptionError && (
              <div className="mb-2 flex items-center justify-center">
                <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full border border-red-200 dark:border-red-800">
                  <span className="text-xs text-red-700 dark:text-red-300">
                    Transcription failed: {transcriptionError}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-4 h-4 p-0 text-red-700 dark:text-red-300"
                    onClick={() => setTranscriptionError(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="relative group">
                    {attachment.type.startsWith("image/") ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(attachment.file)}
                          alt={attachment.name}
                          className="rounded-lg border border-gray-200 dark:border-gray-700 object-cover"
                          style={{ 
                            width: isMobile ? "60px" : "80px", 
                            height: isMobile ? "60px" : "80px" 
                          }}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm max-w-32 truncate text-gray-700 dark:text-gray-300">
                          {attachment.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={onSubmit} className="relative">
              <div
                className={cn(
                  "flex items-end gap-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 shadow-sm",
                  isMobile ? "p-2" : "p-3",
                )}
              >
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button
                    ref={micButtonRef}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(getMicButtonColor(), recordingState === "recording" && "animate-pulse")}
                    onClick={handleMicClick}
                    onTouchStart={handleMicTouchStart}
                    onTouchEnd={handleMicTouchEnd}
                    disabled={isConverting}
                    title={
                      isMobile
                        ? "Hold to record voice message (auto-transcribed)"
                        : recordingState === "idle"
                          ? "Click to start recording (auto-transcribed)"
                          : recordingState === "recording"
                            ? "Click to stop recording"
                            : "Click to record again"
                    }
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                </div>

                <Textarea
                  ref={textareaRef}
                  name="message"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    e.target.style.height = "auto"
                    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px"
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Synth..."
                  className="flex-1 min-h-[24px] max-h-[200px] resize-none border-0 focus:ring-0 focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  disabled={isLoading}
                  rows={1}
                />

                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || isConverting || (!input.trim() && attachments.length === 0 && !voiceBlob)}
                  className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black rounded-lg px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              {isMobile ? "Hold mic to record & transcribe • " : "Click mic to record & transcribe • "}
              Synth can make mistakes. Check important automotive information.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.txt"
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
        </div>
      </div>
    </div>
  )
}