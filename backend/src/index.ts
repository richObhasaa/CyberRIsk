import express from "express";
import cors from "cors";
import { ENV } from "./config/env";

import healthRouter from "./routes/health";
import testRouter from "./routes/test";
import urlRouter from "./routes/url";

import authRouter from "./auth/auth.routes";

/* 🔥 IMPORTANT */
import assessmentRouter from "./assessment/assessment.routes";

const app = express();

/* ── Middleware ───────────────────────── */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Routes ───────────────────────────── */
app.use("/api/health", healthRouter);
app.use("/api/test", testRouter);
app.use("/api/url", urlRouter);

/* 🔥 REGISTER ASSESSMENT ROUTES */
app.use("/api/assessment", assessmentRouter);
app.use("/api/auth", authRouter);

/* ── 404 Fallback ─────────────────────── */
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ── Start Server ─────────────────────── */
app.listen(ENV.PORT, () => {
  console.log(
    `✅ CyberRisk API running on http://localhost:${ENV.PORT}`
  );
});

export default app;