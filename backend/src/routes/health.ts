import { Router } from "express";
import axios from "axios";
import { ENV } from "../config/env";

const router = Router();

/**
 * GET /api/health
 * Confirms the API server is up and can reach Supabase by pinging
 * the REST v1 root endpoint (GET <SUPABASE_URL>/rest/v1/).
 */
router.get("/", async (_req, res) => {
    let supabaseStatus: "connected" | "unreachable" = "unreachable";

    try {
        await axios.get(`${ENV.SUPABASE_URL}/rest/v1/`, {
            headers: {
                apikey: ENV.SUPABASE_KEY,
                Authorization: `Bearer ${ENV.SUPABASE_KEY}`,
            },
        });
        supabaseStatus = "connected";
    } catch {
        // Supabase unreachable — still return 200 so load balancers
        // know the API itself is alive; the supabase field signals the issue.
    }

    res.json({
        success: true,
        status: "ok",
        timestamp: new Date().toISOString(),
        supabase: supabaseStatus,
    });
});

export default router;
