"use client"

import { useState } from "react"
import { sendChatMessage, uploadChatFile } from "../lib/api"

export default function ChatbotPage() {
  const [message, setMessage] = useState("")
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleSend = async () => {
    if (!message.trim()) return

    try {
      setLoading(true)
      setReply("")

      const data = await sendChatMessage({ message })
      setReply(data.reply)

    } catch (err: any) {
      setReply(err.message || "Error sending message")
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setLoading(true)
      setReply("")

      const data = await uploadChatFile(file)
      setReply(data.reply)

    } catch (err: any) {
      setReply(err.message || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h1>Cybersecurity AI Chatbot</h1>

      {/* TEXT CHAT */}
      <div style={{ marginBottom: 30 }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something about NIST CSF or cybersecurity..."
          style={{
            width: "100%",
            height: 120,
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            marginTop: 10,
            padding: "8px 16px",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* FILE UPLOAD */}
      <div style={{ marginBottom: 30 }}>
        <input
          type="file"
          onChange={(e) =>
            setFile(e.target.files ? e.target.files[0] : null)
          }
        />

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          style={{
            marginLeft: 10,
            padding: "8px 16px",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          {loading ? "Uploading..." : "Upload & Analyze"}
        </button>
      </div>

      {/* RESPONSE */}
      <div
        style={{
          background: "#f4f4f4",
          padding: 20,
          borderRadius: 6,
          whiteSpace: "pre-wrap"
        }}
      >
        <strong>AI Response:</strong>
        <div style={{ marginTop: 10 }}>
          {reply || "No response yet"}
        </div>
      </div>
    </div>
  )
}