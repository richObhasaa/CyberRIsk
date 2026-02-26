import dotenv from "dotenv"
dotenv.config()

import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import axios from "axios"
import multer from "multer"
import fs from "fs"
import pdfParse from "pdf-parse"
import mammoth from "mammoth"
import Tesseract from "tesseract.js"

import { guardMiddleware } from "./middleware/guard"

const app = express()

app.use(cors())
app.use(express.json())

// =======================
// Multer config (10MB)
// =======================
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }
})

app.get("/", (_req: Request, res: Response) => {
  res.send("Chatbot backend running 🚀")
})

/* =======================
   Chat via text
======================= */
app.post(
  "/api/chat",
  guardMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { message } = req.body as { message: string }

      const response = await axios.post(
        "https://api.deepseek.com/v1/chat/completions",
        {
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You are a cybersecurity assistant." },
            { role: "user", content: message }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json"
          },
          timeout: 30000
        }
      )

      const aiReply =
        response.data?.choices?.[0]?.message?.content ?? "No response"

      res.json({ success: true, reply: aiReply })

    } catch (err: any) {
      console.error("=== CHAT ERROR ===", err.message || err)
      res.status(500).json({ error: err.message || err })
    }
  }
)

/* =======================
   Upload file/image
======================= */
app.post(
  "/api/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file

      if (!file) {
        res.status(400).json({ error: "File is required" })
        return
      }

      let extractedText = ""

      if (file.mimetype === "application/pdf") {
        const buffer = fs.readFileSync(file.path)
        const pdfData = await pdfParse(buffer)
        extractedText = pdfData.text

      } else if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({ path: file.path })
        extractedText = result.value

      } else if (file.mimetype.startsWith("text/")) {
        extractedText = fs.readFileSync(file.path, "utf-8")

      } else if (file.mimetype.startsWith("image/")) {
        const result = await Tesseract.recognize(file.path, "eng")
        extractedText = result.data.text || ""

      } else {
        fs.unlinkSync(file.path)
        res.status(400).json({ error: "Unsupported file type" })
        return
      }

      fs.unlinkSync(file.path)

      // Guard check
      await new Promise<void>((resolve, reject) => {
        const fakeReq = { body: { message: extractedText } } as Request
        const fakeRes = {
          status: (code: number) => ({
            json: (obj: any) => reject(obj)
          })
        } as unknown as Response

        guardMiddleware(fakeReq, fakeRes, () => resolve())
      })

      // Send to DeepSeek
      const response = await axios.post(
        "https://api.deepseek.com/v1/chat/completions",
        {
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You are a cybersecurity assistant." },
            { role: "user", content: extractedText }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json"
          },
          timeout: 30000
        }
      )

      const aiReply =
        response.data?.choices?.[0]?.message?.content ?? "No response"

      res.json({ success: true, reply: aiReply })

    } catch (err: any) {
      console.error("=== UPLOAD ERROR ===", err)
      res.status(500).json({ error: err.error || err })
    }
  }
)

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000")
})