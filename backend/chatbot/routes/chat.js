const { generateResponse, checkContext } = require("../services/aiService")

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { message } = req.body

    const isAllowed = await checkContext(message)

    if (isAllowed !== "YES") {
      return res.status(400).json({
        error: "Out of context. Only cybersecurity topics allowed."
      })
    }

    const aiResponse = await generateResponse(message)

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
const fs = require("fs")

let fileContent = ""

if (req.file) {
  fileContent = fs.readFileSync(req.file.path, "utf8")
}
const aiResponse = await generateResponse(
  message + "\n\nFile Content:\n" + fileContent
)