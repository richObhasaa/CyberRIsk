import { Router } from "express";
import { supabase } from "../db/supabase";

const router = Router();

/**
 * GET /api/health
 * Basic health check — confirms the API server is up and can reach Supabase.
 */
router.get("/", async (_req, res) => {
    try {
        // Lightweight Supabase connectivity check
        const { error } = await supabase.from("_health").select("1").limit(1);

        res.json({
            success: true,
            status: "ok",
            timestamp: new Date().toISOString(),
            supabase: error ? "unreachable" : "connected",
        });
    } catch {
        res.status(500).json({
            success: false,
            status: "error",
            timestamp: new Date().toISOString(),
            supabase: "unreachable",
        });
    }
});

export default router;
