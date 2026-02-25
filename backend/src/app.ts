import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cors from "cors";

import { supabase } from "./lib/supabase";
import riskRouter from "./routes/risk";

dotenv.config();

const app = express();

/* ===============================
   🔐 GLOBAL MIDDLEWARE
=============================== */

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* ===============================
   🧭 API ROUTER
=============================== */

const apiRouter = express.Router();

/* ---------- HEALTH CHECK ---------- */
apiRouter.get("/health", async (_req, res) => {
  let supabaseStatus = "unreachable";

  try {
    const { error } = await supabase
      .from("risk_assessments")
      .select("id")
      .limit(1);

    if (!error) supabaseStatus = "reachable";
  } catch (err) {
    console.error("Supabase health check failed");
  }

  res.json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
    supabase: supabaseStatus,
  });
});

/* ---------- RISK ROUTES ---------- */
apiRouter.use("/risk", riskRouter);

/* ---------- MOUNT API ---------- */
app.use("/api", apiRouter);

/* ===============================
   🚨 404 HANDLER
=============================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

export default app;