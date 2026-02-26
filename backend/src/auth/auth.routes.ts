import express from "express";
import { supabase } from "../db/supabase";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json({
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token,
    user: data.user,
  });
});

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json(data);
});

// REFRESH TOKEN
router.post("/refresh", async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: "refresh_token required" });
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token,
  });

  if (error || !data.session) {
    return res.status(401).json({ error: error?.message || "Refresh failed" });
  }

  return res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: data.user,
  });
});

export default router;