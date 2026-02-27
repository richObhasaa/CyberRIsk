"use client";

import { useNavbar } from "@/app/context/NavbarContext";
import { useEffect } from "react";
import StatsSection from "../layouts/StatsSection";
import ListLayout from "../layouts/ListLayout";

export default function AdminMainPage() {
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return

    if (!isAcceptedFile(selectedFile)) {
      alert("Only PDF and image files supported.")
      return
    }

    setFile(selectedFile)

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => setFilePreview(e.target?.result as string)
      reader.readAsDataURL(selectedFile)
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

    setMessages(prev => [...prev, userMsg])
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

      setMessages(prev => [
        ...prev,
        { role: "ai", text: data.reply || "No response" }
      ])
      setMessage("")
      scrollToBottom()
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Error occurred" }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6 pt-10 bg-black text-white px-25 h-screen overflow-hidden">

      {/* Header Section */}
      <div className="flex flex-col">
        <p className="text-4xl font-bold">CyberRisk AI Assistant</p>
        <p className="text-[#B19EEF] uppercase tracking-widest text-xs mt-1">
          PDF & Image Analysis Engine
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 border border-neutral-800 rounded-xl flex flex-col overflow-hidden">

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] px-4 py-3 text-sm rounded-xl ${
                  msg.role === "user"
                    ? "bg-[#B19EEF] text-black"
                    : "bg-neutral-900 border border-neutral-800 text-gray-300"
                }`}
              >
                {msg.filePreview && (
                  <img src={msg.filePreview} className="max-h-40 mb-2 rounded" />
                )}
                {msg.fileName && msg.fileType === "application/pdf" && (
                  <div className="text-xs text-[#B19EEF] mb-2">
                    {msg.fileName}
                  </div>
                )}
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-sm text-gray-500">
              AI is analyzing...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-neutral-800 p-4 flex gap-3 items-center">

          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-lg hover:border-[#B19EEF]"
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
            placeholder="Ask about NIST CSF..."
            rows={1}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#B19EEF]"
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-[#B19EEF] text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90"
          >
            Send
          </button>

        </div>
      </div>
    </div>
  )
}