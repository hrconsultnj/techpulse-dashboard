import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Icon } from '@iconify/react'
import { useMobile } from "@/hooks/use-mobile"
import { useAudioRecording } from "@/hooks/useAudioRecording"
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

  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const transcribedAudioRef = useRef<Blob | null>(null)
  const isMobile = useMobile()

  // Audio recording hook
  const {
    isRecording,
    isTranscribing,
    duration,
    audioBlob,
    transcriptionText,
    error: audioError,
    startRecording,
    stopRecording,
    clearRecording,
    transcribeRecording
  } = useAudioRecording()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle audio transcription and auto-insertion into input
  useEffect(() => {
    if (transcriptionText && transcriptionText.trim()) {
      setInput(transcriptionText)
    }
  }, [transcriptionText])

  // Auto-transcribe when recording stops and audio is available
  useEffect(() => {
    if (audioBlob && !isRecording && !isTranscribing && audioBlob !== transcribedAudioRef.current) {
      transcribedAudioRef.current = audioBlob
      transcribeRecording()
    }
  }, [audioBlob, isRecording, isTranscribing, transcribeRecording])

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
      // Use the Next.js API route (updated from Vite)
      const proxyUrl = "/api/webhook-proxy?type=customer-support"
      console.log("Sending to Next.js webhook proxy:", proxyUrl)
      console.log("FormData contents:")

      // Log FormData contents for debugging
      const entries = Array.from(formData.entries())
      for (const [key, value] of entries) {
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
        content: `${errorMessage}\n\n**Debug Info:**\n- Using Next.js API route for secure webhook proxy\n- Error: ${error instanceof Error ? error.message : "Unknown error"}\n- Check browser console for more details.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    }
  }, [])

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!input.trim() && attachments.length === 0 && !audioBlob) return

      // Prevent double submission
      if (isLoading) {
        console.warn("Submission already in progress")
        return
      }

      try {
        setIsLoading(true)

        let messageContent = input
        if (!messageContent && audioBlob) {
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
          hasVoice: !!audioBlob,
        }

        setMessages((prev) => [...prev, userMessage])

        await sendToN8n(input, audioBlob || undefined, attachments.length > 0 ? attachments : undefined)

        // Clear form
        setInput("")
        setAttachments([])
        clearRecording()
        transcribedAudioRef.current = null

        if (textareaRef.current) {
          textareaRef.current.style.height = "auto"
          textareaRef.current.style.overflowY = "hidden"
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
    [input, attachments, audioBlob, sendToN8n, clearRecording],
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
    clearRecording()
  }, [clearRecording])




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
            <Icon icon="feather:plus" className="w-4 h-4 mr-2" />
            New chat
          </Button>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-gray-800 lg:hidden mt-4"
            >
              <Icon icon="feather:x" className="w-5 h-5" />
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
              <Icon icon="feather:user" className="w-4 h-4" />
              <span>TechPulse User</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {darkMode ? <Icon icon="feather:sun" className="w-4 h-4" /> : <Icon icon="feather:moon" className="w-4 h-4" />}
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
                <Icon icon="feather:menu" className="w-5 h-5" />
              ) : sidebarOpen ? (
                <Icon icon="feather:sidebar" className="w-5 h-5" />
              ) : (
                <Icon icon="feather:sidebar" className="w-5 h-5" />
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
            <Icon icon="feather:settings" className="w-5 h-5" />
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
                        <Icon icon="feather:user" className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
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
                              <Icon icon="feather:file-text" className="w-5 h-5 text-gray-500 dark:text-gray-400" />
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
                          <Icon icon="feather:x" className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Icon icon="feather:file-text" className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm max-w-32 truncate text-gray-700 dark:text-gray-300">
                          {attachment.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100"
                          onClick={() => removeAttachment(index)}
                        >
                          <Icon icon="feather:x" className="w-3 h-3" />
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
                    <Icon icon="feather:paperclip" className="w-5 h-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      isRecording 
                        ? "text-red-500 hover:text-red-600 animate-pulse" 
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    )}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isTranscribing}
                    title={
                      isRecording
                        ? `Recording ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, "0")} - Click to stop`
                        : isTranscribing
                          ? "Transcribing audio..."
                          : "Click to start recording (auto-transcribed)"
                    }
                  >
                    {isRecording ? (
                      <Icon icon="feather:square" className="w-5 h-5" />
                    ) : isTranscribing ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                    ) : (
                      <Icon icon="feather:mic" className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                <Textarea
                  ref={textareaRef}
                  name="message"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    // Reset height to auto to get accurate scrollHeight
                    e.target.style.height = "auto"
                    // Set height up to max of 120px (about 5 lines), then scroll
                    const maxHeight = 120
                    if (e.target.scrollHeight <= maxHeight) {
                      e.target.style.height = e.target.scrollHeight + "px"
                      e.target.style.overflowY = "hidden"
                    } else {
                      e.target.style.height = maxHeight + "px"
                      e.target.style.overflowY = "auto"
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Synth..."
                  className="flex-1 min-h-[24px] max-h-[120px] resize-none border-0 focus:ring-0 focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 overflow-y-auto"
                  disabled={isLoading}
                  rows={1}
                />

                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || isTranscribing || (!input.trim() && attachments.length === 0 && !audioBlob)}
                  className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black rounded-lg px-3"
                >
                  <Icon icon="feather:send" className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {audioError && (
              <p className="text-xs text-red-500 dark:text-red-400 text-center mt-1">
                ⚠️ {audioError}
              </p>
            )}
            {isRecording && (
              <p className="text-xs text-blue-500 dark:text-blue-400 text-center mt-1">
                🎤 Recording {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
              </p>
            )}
            {isTranscribing && (
              <p className="text-xs text-amber-500 dark:text-amber-400 text-center mt-1">
                ⏳ Transcribing audio...
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Click mic to record & transcribe • Synth can make mistakes. Check important automotive information.
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