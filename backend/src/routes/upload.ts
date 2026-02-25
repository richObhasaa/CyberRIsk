import express from "express";
import multer from "multer";
import { supabase } from "../lib/supabase";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/evidence",
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file" });
      }

      const fileName = `evidence-${Date.now()}-${file.originalname}`;

      const { error } = await supabase.storage
        .from("audit-evidence")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("audit-evidence")
        .getPublicUrl(fileName);

      res.json({ url: publicUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;