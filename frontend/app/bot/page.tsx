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
    <div className="w-full flex flex-col gap-6 pt-10 md:pt-20 bg-black text-white px-25 h-screen overflow-hidden">

      {/* Header */}
      <div className="flex flex-col">
        <p className="text-4xl font-bold">CyberRisk AI Assistant</p>
        <p className="text-[#B19EEF] uppercase tracking-widest text-xs mt-1">
          NIST CSF & Security Analysis Engine
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 border border-neutral-800 rounded-xl flex flex-col overflow-hidden bg-neutral-950">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 relative">

          {messages.length === 0 && (
            <div className="absolute inset-0 flex items-end justify-center pb-[25%] text-center text-neutral-600 px-10">
              <p className="text-sm">
                Ask about NIST CSF, cybersecurity, or upload a PDF/image.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] px-4 py-3 text-sm rounded-xl ${msg.role === "user"
                  ? "bg-[#B19EEF] text-black"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-300"
                  }`}
              >
                {msg.filePreview && msg.fileType?.startsWith("image/") && (
                  <img
                    src={msg.filePreview}
                    alt={msg.fileName}
                    className="max-w-full max-h-48 rounded mb-2"
                  />
                )}

                {msg.fileName && msg.fileType === "application/pdf" && (
                  <div className="text-xs text-[#B19EEF] mb-2">
                    {msg.fileName}
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-sm text-neutral-500">
              AI is analyzing...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* File Preview Bar */}
        {file && (
          <div className="mx-8 mb-3 flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3">
            {filePreview && file.type.startsWith("image/") ? (
              <img src={filePreview} alt={file.name} className="w-12 h-12 rounded object-cover" />
            ) : (
              <div className="w-12 h-12 rounded bg-neutral-800 flex items-center justify-center text-xs">
                PDF
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{file.name}</p>
              <p className="text-xs text-neutral-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={clearFile} className="text-neutral-500 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Input */}
        <div
          className={`px-8 py-5 border-t border-neutral-800 ${dragOver ? "bg-[#B19EEF]/10" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="flex items-end gap-3">

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-[#B19EEF]"
            >
              Upload
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_STRING}
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={file ? "Add a message (optional)..." : "Ask about NIST CSF..."}
              rows={1}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#B19EEF]"
            />

            <button
              onClick={handleSend}
              disabled={loading || (!message.trim() && !file)}
              className="px-5 py-2 bg-[#B19EEF] text-black font-semibold rounded-lg disabled:opacity-40"
            >
              Send
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}