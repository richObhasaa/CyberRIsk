import { Router, Request, Response } from "express"
import fs from "fs"
import multer from "multer"
import { generateResponse } from "../services/aiservice"

const router = Router()
const upload = multer({ dest: "uploads/" })

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const { message } = req.body as { message: string }

    let fileContent = ""

    if (req.file) {
      fileContent = fs.readFileSync(req.file.path, "utf8")
    }

    const aiResponse = await generateResponse(
      message + "\n\nFile Content:\n" + fileContent
    )

    res.json({
      success: true,
      reply: aiResponse,
      file: req.file ? req.file.filename : null
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "AI error" })
  }
})

export default router