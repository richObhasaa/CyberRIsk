import express from "express";

const router = express.Router();

// mock upload (bisa nanti ke Supabase Storage)
router.post("/upload", async (req, res) => {
  return res.json({
    success: true,
    message: "Evidence uploaded (mock)",
  });
});

export default router;