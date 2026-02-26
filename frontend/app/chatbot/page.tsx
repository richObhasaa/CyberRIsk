"use client"

import { useState, useRef } from "react"
import { sendChatMessage, uploadChatFile } from "../lib/api"

interface ChatMessage {
  role: "user" | "ai"
  text: string
  fileName?: string
  filePreview?: string
  fileType?: string
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "image/bmp",
]

const ACCEPT_STRING = ".pdf,.png,.jpg,.jpeg,.gif,.webp,.bmp"

function isAcceptedFile(file: File): boolean {
  return ACCEPTED_TYPES.includes(file.type)
}

export default function ChatbotPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null)
      setFilePreview(null)
      return
    }

    if (!isAcceptedFile(selectedFile)) {
      alert("Only PDF and image files (PNG, JPG, GIF, WebP, BMP) are supported.")
      return
    }

    setFile(selectedFile)

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => setFilePreview(e.target?.result as string)
      reader.readAsDataURL(selectedFile)
    } else {
      setFilePreview(null)
    }
  }

  const clearFile = () => {
    setFile(null)
    setFilePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSend = async () => {
    if (!message.trim() && !file) return

    const userMsg: ChatMessage = {
      role: "user",
      text: message || (file ? `Uploaded: ${file.name}` : ""),
      fileName: file?.name,
      filePreview: filePreview || undefined,
      fileType: file?.type,
    }
    setMessages((prev) => [...prev, userMsg])
    scrollToBottom()

    try {
      setLoading(true)
      let data: any

      if (file) {
        data = await uploadChatFile(file, message || undefined)
        clearFile()
      } else {
        data = await sendChatMessage({ message })
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "No response" },
      ])
      setMessage("")
      scrollToBottom()
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: `Error: ${err.message || "Something went wrong"}` },
      ])
      scrollToBottom()
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) handleFileSelect(droppedFile)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1029] to-[#1a1b3a] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#14152a] rounded-2xl shadow-2xl border border-[#2a2b4a] flex flex-col h-[85vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2b4a] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B19EEF] to-[#7c6bc4] flex items-center justify-center text-white font-bold text-lg">
            AI
          </div>
          <div>
            <h1 className="text-white text-lg font-semibold">CyberRisk AI Assistant</h1>
            <p className="text-gray-400 text-xs">Supports PDF & image uploads for analysis</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-3">
              <div className="w-16 h-16 rounded-full bg-[#1e1f3a] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#B19EEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-sm">Ask about NIST CSF, cybersecurity, or upload a PDF/image for analysis.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#B19EEF] text-white rounded-br-md"
                    : "bg-[#1e1f3a] text-gray-200 rounded-bl-md border border-[#2a2b4a]"
                }`}
              >
                {/* File preview in message */}
                {msg.filePreview && msg.fileType?.startsWith("image/") && (
                  <img
                    src={msg.filePreview}
                    alt={msg.fileName}
                    className="max-w-full max-h-48 rounded-lg mb-2 object-contain"
                  />
                )}
                {msg.fileName && msg.fileType === "application/pdf" && (
                  <div className="flex items-center gap-2 mb-2 bg-black/20 rounded-lg px-3 py-2">
                    <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
                    </svg>
                    <span className="text-xs truncate">{msg.fileName}</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#1e1f3a] border border-[#2a2b4a] rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-[#B19EEF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-[#B19EEF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-[#B19EEF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* File preview bar */}
        {file && (
          <div className="mx-6 mb-2 flex items-center gap-3 bg-[#1e1f3a] border border-[#2a2b4a] rounded-xl px-4 py-3">
            {filePreview && file.type.startsWith("image/") ? (
              <img src={filePreview} alt={file.name} className="w-12 h-12 rounded-lg object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{file.name}</p>
              <p className="text-gray-400 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={clearFile}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Input area */}
        <div
          className={`px-6 py-4 border-t border-[#2a2b4a] ${dragOver ? "bg-[#B19EEF]/10" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {dragOver && (
            <div className="text-center text-[#B19EEF] text-sm mb-2">
              Drop your PDF or image here
            </div>
          )}
          <div className="flex items-end gap-3">
            {/* Upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-[#1e1f3a] border border-[#2a2b4a] text-gray-400 hover:text-[#B19EEF] hover:border-[#B19EEF]/50 transition-all flex-shrink-0"
              title="Upload PDF or Image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_STRING}
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            />

            {/* Message input */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={file ? "Add a message (optional)..." : "Ask about cybersecurity or NIST CSF..."}
              rows={1}
              className="flex-1 bg-[#1e1f3a] border border-[#2a2b4a] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 resize-none focus:outline-none focus:border-[#B19EEF]/50 transition-colors"
              style={{ maxHeight: 120 }}
            />

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={loading || (!message.trim() && !file)}
              className="p-2.5 rounded-xl bg-[#B19EEF] text-white hover:bg-[#9b85e0] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-2 text-center">
            Supports PDF & images (PNG, JPG, GIF, WebP) — max 10MB
          </p>
        </div>
      </div>
    </div>
  )
}