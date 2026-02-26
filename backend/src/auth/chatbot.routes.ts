import { Router, Request, Response } from "express"
import multer from "multer"
import fs from "fs"
import pdfParse from "pdf-parse"
import mammoth from "mammoth"
import Tesseract from "tesseract.js"
import axios from "axios"

import { guardMiddleware } from "../../chatbot/middleware/guard"

const router = Router()

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }
})

/* =======================
   TEXT CHAT
======================= */
router.post(
  "/chat",
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
      res.status(500).json({ error: err.message || err })
    }
  }
)

/* =======================
   FILE UPLOAD
======================= */
router.post(
  "/upload",
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
          }
        }
      )

      const aiReply =
        response.data?.choices?.[0]?.message?.content ?? "No response"

      res.json({ success: true, reply: aiReply })

    } catch (err: any) {
      res.status(500).json({ error: err.message || err })
    }
  }
)

export default router