// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const tesseract = require("tesseract.js");

const guardMiddleware = require("./middleware/guard");

const app = express();
app.use(cors());
app.use(express.json());

// Multer config + limit 10MB
const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.get("/", (req, res) => res.send("Chatbot backend running 🚀"));

// =======================
// Chat via text
// =======================
app.post("/api/chat", guardMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

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
        headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`, "Content-Type": "application/json" },
        timeout: 30000
      }
    );

    const aiReply = response.data?.choices?.[0]?.message?.content || "No response";
    res.json({ success: true, reply: aiReply });
  } catch (err) {
    console.log("=== CHAT ERROR ===", err.message || err);
    res.status(500).json({ error: err.message || err });
  }
});

// =======================
// Upload file/image
// =======================
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "File is required" });

    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      const buffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ path: file.path });
      extractedText = result.value;
    } else if (file.mimetype.startsWith("text/")) {
      extractedText = fs.readFileSync(file.path, "utf-8");
    } else if (file.mimetype.startsWith("image/")) {
      const result = await tesseract.recognize(file.path, "eng");
      extractedText = result.data.text || "";
    } else {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: "Unsupported file type" });
    }

    fs.unlinkSync(file.path); // hapus sementara

    // Guard check
    const fakeReq = { body: { message: extractedText } };
    const fakeRes = { status: (code) => ({ json: (obj) => { throw obj; } }) };
    await guardMiddleware(fakeReq, fakeRes, () => {});

    // Kirim ke DeepSeek
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
        headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`, "Content-Type": "application/json" },
        timeout: 30000
      }
    );

    const aiReply = response.data?.choices?.[0]?.message?.content || "No response";
    res.json({ success: true, reply: aiReply });
  } catch (err) {
    console.log("=== UPLOAD ERROR ===", err);
    res.status(500).json({ error: err.error || err });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));