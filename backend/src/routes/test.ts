import { Router, Request, Response } from "express";

const router = Router();

// ─────────────────────────────────────────────
//  GET /api/test
//  Simple echo endpoint to confirm routing works
// ─────────────────────────────────────────────
router.get("/", (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: "API is working!",
        timestamp: new Date().toISOString(),
    });
});

// ─────────────────────────────────────────────
//  GET /api/test/echo?message=hello
//  Echo back a query parameter
// ─────────────────────────────────────────────
router.get("/echo", (req: Request, res: Response) => {
    const { message } = req.query;
    res.json({
        success: true,
        echo: message ?? "(no message provided)",
        timestamp: new Date().toISOString(),
    });
});

// ─────────────────────────────────────────────
//  POST /api/test/echo
//  Echo back a JSON body
// ─────────────────────────────────────────────
router.post("/echo", (req: Request, res: Response) => {
    res.json({
        success: true,
        received: req.body,
        timestamp: new Date().toISOString(),
    });
});

// ─────────────────────────────────────────────
//  GET /api/test/error
//  Simulates a server error — for error-handling tests
// ─────────────────────────────────────────────
router.get("/error", (_req: Request, res: Response) => {
    res.status(500).json({
        success: false,
        message: "This is a simulated error for testing.",
        timestamp: new Date().toISOString(),
    });
});

export default router;
