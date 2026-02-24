import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import healthRouter from "./routes/health";
import testRouter from "./routes/test";
import urlRouter from "./routes/url";

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
app.use("/api/health", healthRouter);
app.use("/api/test", testRouter);
app.use("/api/url", urlRouter);

// ── 404 Fallback ────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// ── Start Server ────────────────────────────────────────────
app.listen(ENV.PORT, () => {
    console.log(`✅ CyberRisk API running on http://localhost:${ENV.PORT}`);
});

export default app;
